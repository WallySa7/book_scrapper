async function scrapeAlkutubiyeen(query, browser, limit = 5) {
  const page = await browser.newPage();

  try {
    // Set user agent to avoid bot detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    );

    // Navigate to search page
    const searchUrl = `https://alkutubiyeen.net/search?q=${encodeURIComponent(
      query
    )}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 15000 });

    // Wait for search results
    await page.waitForSelector(".product-item, .book-item, .search-result", {
      timeout: 10000,
    });

    // Extract book data
    const books = await page.evaluate((limit) => {
      const bookElements = document.querySelectorAll(
        ".product-item, .book-item, .search-result"
      );
      const results = [];

      for (let i = 0; i < Math.min(bookElements.length, limit); i++) {
        const book = bookElements[i];

        const title = book
          .querySelector(".title, .product-name, h3, h4")
          ?.textContent?.trim();
        const priceElement = book.querySelector(".price, .cost, .amount");
        const price = priceElement?.textContent?.trim();
        const linkElement = book.querySelector("a");
        const imageElement = book.querySelector("img");

        // Check stock status
        const outOfStock = book.querySelector(
          ".out-of-stock, .unavailable, .sold-out"
        );
        const inStock = !outOfStock;

        if (title) {
          results.push({
            title,
            price: price || "السعر غير متوفر",
            inStock,
            url: linkElement?.href
              ? new URL(linkElement.href, "https://alkutubiyeen.net").href
              : null,
            image: imageElement?.src
              ? new URL(imageElement.src, "https://alkutubiyeen.net").href
              : null,
            author:
              book.querySelector(".author, .writer")?.textContent?.trim() ||
              null,
          });
        }
      }

      return results;
    }, limit);

    return books;
  } catch (error) {
    console.error("Alkutubiyeen scraping error:", error);
    return [];
  } finally {
    await page.close();
  }
}

module.exports = { scrapeAlkutubiyeen };
