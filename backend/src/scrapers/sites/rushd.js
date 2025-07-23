async function scrapeRushd(query, browser, limit = 5) {
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    );

    const searchUrl = `https://rushd.sa/search?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 15000 });

    await page.waitForSelector(".product-item, .book-card", { timeout: 10000 });

    const books = await page.evaluate((limit) => {
      const bookElements = document.querySelectorAll(
        ".product-item, .book-card"
      );
      const results = [];

      for (let i = 0; i < Math.min(bookElements.length, limit); i++) {
        const book = bookElements[i];

        const title = book
          .querySelector(".product-title, .book-title")
          ?.textContent?.trim();
        const price = book
          .querySelector(".price, .book-price")
          ?.textContent?.trim();
        const link = book.querySelector("a");
        const image = book.querySelector("img");

        const inStock = !book.querySelector(".out-of-stock");

        if (title) {
          results.push({
            title,
            price: price || "السعر غير متوفر",
            inStock,
            url: link?.href
              ? new URL(link.href, "https://rushd.sa").href
              : null,
            image: image?.src
              ? new URL(image.src, "https://rushd.sa").href
              : null,
            author: book.querySelector(".author")?.textContent?.trim() || null,
          });
        }
      }

      return results;
    }, limit);

    return books;
  } catch (error) {
    console.error("Rushd scraping error:", error);
    return [];
  } finally {
    await page.close();
  }
}

module.exports = { scrapeRushd };
