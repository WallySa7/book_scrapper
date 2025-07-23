function validateSearchQuery(query) {
  if (!query || typeof query !== "string") {
    return { valid: false, message: "Search query is required" };
  }

  if (query.trim().length < 2) {
    return {
      valid: false,
      message: "Search query must be at least 2 characters",
    };
  }

  if (query.length > 100) {
    return {
      valid: false,
      message: "Search query too long (max 100 characters)",
    };
  }

  return { valid: true };
}

module.exports = {
  validateSearchQuery,
};
