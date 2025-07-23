const puppeteer = require("puppeteer");

let browserPool = [];
const MAX_BROWSERS = 3;

async function initializeBrowser() {
  console.log("🌐 Initializing browser pool...");

  for (let i = 0; i < MAX_BROWSERS; i++) {
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });
    browserPool.push({ browser, inUse: false });
  }

  console.log(`✅ Browser pool initialized with ${MAX_BROWSERS} browsers`);
}

async function getBrowser() {
  const availableBrowser = browserPool.find((b) => !b.inUse);

  if (availableBrowser) {
    availableBrowser.inUse = true;
    return availableBrowser;
  }

  // If no available browser, wait and retry
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return getBrowser();
}

function releaseBrowser(browserInstance) {
  browserInstance.inUse = false;
}

module.exports = {
  initializeBrowser,
  getBrowser,
  releaseBrowser,
};
