const express = require("express");
const { searchAllBookstores } = require("../scrapers");
const { getCache, setCache } = require("../utils/cache");
const { validateSearchQuery } = require("../utils/validation");

const router = express.Router();

router.get("/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const { websites, limit = 5 } = req.query;

    // Validate input
    const validation = validateSearchQuery(query);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    // Parse selected websites
    const selectedWebsites = websites ? websites.split(",") : null;

    // Generate cache key
    const cacheKey = `search:${query}:${websites || "all"}:${limit}`;

    // Check cache first
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json({
        results: cached,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }

    // Perform search
    console.log(
      `🔍 Searching for: "${query}" across ${
        selectedWebsites?.length || "all"
      } websites`
    );

    const results = await searchAllBookstores(query, {
      websites: selectedWebsites,
      limit: parseInt(limit),
    });

    // Cache results for 5 minutes
    await setCache(cacheKey, results, 300);

    res.json({
      results,
      cached: false,
      timestamp: new Date().toISOString(),
      totalFound: results.filter((r) => r.success).length,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Get available bookstores
router.get("/bookstores/list", (req, res) => {
  const { getBookstoresList } = require("../scrapers");
  res.json({ bookstores: getBookstoresList() });
});

module.exports = router;
