const NodeCache = require("node-cache");

// Create cache instance with TTL of 5 minutes
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

async function getCache(key) {
  try {
    return cache.get(key);
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
}

async function setCache(key, value, ttl = 300) {
  try {
    cache.set(key, value, ttl);
    return true;
  } catch (error) {
    console.error("Cache set error:", error);
    return false;
  }
}

function clearCache() {
  cache.flushAll();
}

module.exports = {
  getCache,
  setCache,
  clearCache,
};
