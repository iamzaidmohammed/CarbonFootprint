const { scanUrl } = require("../services/ScannerService");
const { calculateEmissions } = require("../services/CalculatorService");

const runAudit = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    // 1. Scan the site
    const scanData = await scanUrl(url);

    // 2. Calculate emissions (Assume false for green host for now)
    const emissions = calculateEmissions(scanData.totalBytes, false);

    // 3. Return combined data
    res.json({
      url,
      timestamp: new Date(),
      breakdown: scanData,
      statistics: emissions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { runAudit };
