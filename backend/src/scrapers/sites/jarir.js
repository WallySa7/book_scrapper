async function scrapeJarir(query, browser, limit = 5) {
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    );

    // Navigate to Jarir search
    const searchUrl = `https://www.jarir.com/sa-en/search?q=${encodeURIComponent(
      query
    )}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 15000 });

    // Wait for results
    await page.waitForSelector(".product-item-info, .product-tile", {
      timeout: 10000,
    });

    const books = await page.evaluate((limit) => {
      const bookElements = document.querySelectorAll(
        ".product-item-info, .product-tile"
      );
      const results = [];

      for (let i = 0; i < Math.min(bookElements.length, limit); i++) {
        const book = bookElements[i];

        const title = book
          .querySelector(".product-item-link, .product-title")
          ?.textContent?.trim();
        const price = book
          .querySelector(".price, .regular-price")
          ?.textContent?.trim();
        const link = book.querySelector(
          'a.product-item-link, a[href*="product"]'
        );
        const image = book.querySelector(
          ".product-image-photo, .product-image img"
        );

        // Check availability
        const addToCart = book.querySelector(".tocart, .add-to-cart");
        const inStock = !!addToCart && !book.querySelector(".out-of-stock");

        if (title) {
          results.push({
            title,
            price: price || "السعر غير متوفر",
            inStock,
            url: link?.href
              ? new URL(link.href, "https://www.jarir.com").href
              : null,
            image: image?.src
              ? new URL(image.src, "https://www.jarir.com").href
              : null,
            author:
              book
                .querySelector(".product-author, .author")
                ?.textContent?.trim() || null,
          });
        }
      }

      return results;
    }, limit);

    return books;
  } catch (error) {
    console.error("Jarir scraping error:", error);
    return [];
  } finally {
    await page.close();
  }
}

module.exports = { scrapeJarir };
