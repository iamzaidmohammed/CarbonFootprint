const puppeteer = require("puppeteer");

// --- Concurrency cap: each scan launches a full Chrome, so limit how many run at once ---
const MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT_SCANS || "1", 10);
const MAX_QUEUE = 5;
let active = 0;
const waiting = [];

const acquire = () =>
  new Promise((resolve, reject) => {
    if (active < MAX_CONCURRENT) {
      active++;
      return resolve();
    }
    if (waiting.length >= MAX_QUEUE) {
      return reject(new Error("Server is busy. Please try again shortly."));
    }
    waiting.push(resolve);
  });

const release = () => {
  const next = waiting.shift();
  if (next) next(); // hand the slot straight to the next request
  else active--;
};

const runScan = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    acceptInsecureCerts: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920x1080",
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    ],
  });

  try {
    const page = await browser.newPage();

    const resources = {
      totalBytes: 0,
      images: 0,
      scripts: 0,
      css: 0,
      other: 0,
    };

    page.on("response", (response) => {
      const headers = response.headers();
      const size = parseInt(headers["content-length"] || 0);
      const type = headers["content-type"] || "";

      resources.totalBytes += size;
      if (type.includes("image")) resources.images += size;
      else if (type.includes("javascript")) resources.scripts += size;
      else if (type.includes("css")) resources.css += size;
      else resources.other += size;
    });

    await page.goto(url, { waitUntil: "networkidle0", timeout: 45000 });
    return resources;
  } finally {
    await browser.close();
  }
};

const scanUrl = async (url) => {
  await acquire();
  try {
    return await runScan(url);
  } finally {
    release();
  }
};

module.exports = { scanUrl };
