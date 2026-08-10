const puppeteer = require("puppeteer");

const scanUrl = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
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
  const page = await browser.newPage();

  // Store data by category
  const resources = {
    totalBytes: 0,
    images: 0,
    scripts: 0,
    css: 0,
    other: 0,
  };

  // Intercept responses to track sizes
  page.on("response", async (response) => {
    const headers = response.headers();
    const size = parseInt(headers["content-length"] || 0);
    const type = headers["content-type"] || "";

    resources.totalBytes += size;
    if (type.includes("image")) resources.images += size;
    else if (type.includes("javascript")) resources.scripts += size;
    else if (type.includes("css")) resources.css += size;
    else resources.other += size;
  });

  await page.goto(url, { waitUntil: "networkidle0", timeout: 100000 });
  await browser.close();

  return resources;
};

module.exports = { scanUrl };
