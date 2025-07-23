const { getBrowser, releaseBrowser } = require("../utils/browser");

// Import individual scrapers
const { scrapeAlkutubiyeen } = require("./sites/alkutubiyeen");
const { scrapeAlmohadith } = require("./sites/almohadith");
const { scrapeRushd } = require("./sites/rushd");
const { scrapeIbnaljawzi } = require("./sites/ibnaljawzi");
const { scrapeJarir } = require("./sites/jarir");
// ... other scrapers

// Bookstores configuration
const BOOKSTORES = [
  {
    id: "alkutubiyeen",
    name: "الكتبيين",
    url: "https://alkutubiyeen.net",
    scraper: scrapeAlkutubiyeen,
    active: true,
  },
  {
    id: "almohadith",
    name: "المحدث",
    url: "https://almohadith.com/ar",
    scraper: scrapeAlmohadith,
    active: true,
  },
  {
    id: "rushd",
    name: "رشد",
    url: "https://rushd.sa/",
    scraper: scrapeRushd,
    active: true,
  },
  {
    id: "ibnaljawzi",
    name: "ابن الجوزي",
    url: "https://ibnaljawzi.com/",
    scraper: scrapeIbnaljawzi,
    active: true,
  },
  {
    id: "aljameah",
    name: "الجامعة",
    url: "https://aljameah.com",
    scraper: null,
    active: false,
  },
  {
    id: "dartaybaa",
    name: "دار تيباء",
    url: "https://dartaybaa.com/",
    scraper: null,
    active: false,
  },
  {
    id: "daramjad",
    name: "دار أمجد",
    url: "https://daramjad.com/",
    scraper: null,
    active: false,
  },
  {
    id: "wrraqoon",
    name: "ورقون",
    url: "https://wrraqoon.com/index.php?route=common/home",
    scraper: null,
    active: false,
  },
  {
    id: "daralhadarah",
    name: "دار الحضارة",
    url: "https://daralhadarah.net",
    scraper: null,
    active: false,
  },
  {
    id: "kheerjalees",
    name: "خير جليس",
    url: "https://kheerjalees.com/",
    scraper: null,
    active: false,
  },
  {
    id: "jarir",
    name: "جرير",
    url: "https://www.jarir.com",
    scraper: scrapeJarir,
    active: true,
  },
  // Add all 40 bookstores here
];

async function searchAllBookstores(query, options = {}) {
  const { websites, limit = 5 } = options;

  // Filter bookstores based on selection
  let targetBookstores = BOOKSTORES.filter(
    (store) => store.active && store.scraper
  );

  if (websites && websites.length > 0) {
    targetBookstores = targetBookstores.filter((store) =>
      websites.includes(store.id)
    );
  }

  console.log(
    `🔍 Searching ${targetBookstores.length} bookstores for: "${query}"`
  );

  // Create scraping promises
  const scrapePromises = targetBookstores.map(async (bookstore) => {
    const browserInstance = await getBrowser();

    try {
      console.log(`📖 Scraping ${bookstore.name}...`);
      const results = await bookstore.scraper(
        query,
        browserInstance.browser,
        limit
      );

      return {
        bookstore: bookstore.name,
        bookstoreId: bookstore.id,
        url: bookstore.url,
        success: true,
        books: results || [],
        scrapedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`❌ Error scraping ${bookstore.name}:`, error.message);

      return {
        bookstore: bookstore.name,
        bookstoreId: bookstore.id,
        url: bookstore.url,
        success: false,
        error: error.message,
        books: [],
        scrapedAt: new Date().toISOString(),
      };
    } finally {
      releaseBrowser(browserInstance);
    }
  });

  // Execute all scraping operations
  const results = await Promise.allSettled(scrapePromises);

  return results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        success: false,
        error: result.reason.message,
        books: [],
      };
    }
  });
}

function getBookstoresList() {
  return BOOKSTORES.map((store) => ({
    id: store.id,
    name: store.name,
    url: store.url,
    active: store.active,
  }));
}

module.exports = {
  searchAllBookstores,
  getBookstoresList,
};
