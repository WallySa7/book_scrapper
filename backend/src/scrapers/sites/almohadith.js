async function scrapeAlmohadith(query, browser, limit = 5) {
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    );

    const searchUrl = `https://almohadith.com/ar/search?search=${encodeURIComponent(
      query
    )}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 15000 });

    await page.waitForSelector(".product-layout, .product-item", {
      timeout: 10000,
    });

    const books = await page.evaluate((limit) => {
      const bookElements = document.querySelectorAll(
        ".product-layout, .product-item"
      );
      const results = [];

      for (let i = 0; i < Math.min(bookElements.length, limit); i++) {
        const book = bookElements[i];

        const title = book
          .querySelector(".caption h4 a, .product-name a")
          ?.textContent?.trim();
        const price = book
          .querySelector(".price, .price-new")
          ?.textContent?.trim();
        const link = book.querySelector(".caption h4 a, .product-name a");
        const image = book.querySelector(".image img");

        const inStock = !book.querySelector(".out-of-stock, .unavailable");

        if (title) {
          results.push({
            title,
            price: price || "السعر غير متوفر",
            inStock,
            url: link?.href
              ? new URL(link.href, "https://almohadith.com").href
              : null,
            image: image?.src
              ? new URL(image.src, "https://almohadith.com").href
              : null,
            author: null,
          });
        }
      }

      return results;
    }, limit);

    return books;
  } catch (error) {
    console.error("Almohadith scraping error:", error);
    return [];
  } finally {
    await page.close();
  }
}

module.exports = { scrapeAlmohadith };
