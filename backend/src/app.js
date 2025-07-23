const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const searchRoutes = require("./routes/search");
const { initializeBrowser } = require("./utils/browser");

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(express.json());

// Routes
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Arabic Book Scraper API",
    version: "1.0.0",
    endpoints: {
      search: "/api/search/:query",
      health: "/health",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

// Initialize browser pool and start server
initializeBrowser()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
      console.log(`📚 Arabic Book Scraper API ready!`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize browser:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});
