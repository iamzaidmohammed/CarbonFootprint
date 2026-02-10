const { scanUrl } = require("../services/ScannerService");
const { calculateEmissions } = require("../services/CalculatorService");
const { getRecommendations } = require("../services/RecommendationService");
const Audit = require("../models/Audit");

const runAudit = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const scanData = await scanUrl(url);
    const emissions = calculateEmissions(scanData.totalBytes, false);

    // GENERATE RECOMMENDATIONS
    const tips = getRecommendations(scanData);

    const newAudit = new Audit({
      url,
      dataTransfer: scanData,
      emissions: emissions,
      recommendations: tips,
    });

    await newAudit.save();
    res.status(201).json(newAudit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ: Get the last 10 audits from the database
const getHistory = async (req, res) => {
  try {
    const history = await Audit.find().sort({ timestamp: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { runAudit, getHistory };
