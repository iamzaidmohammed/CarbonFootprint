const puppeteer = require("puppeteer");

const scanUrl = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
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

    await page.goto(url, { waitUntil: "networkidle0", timeout: 100000 });
    return resources;
  } finally {
    await browser.close();
  }
};

module.exports = { scanUrl };
