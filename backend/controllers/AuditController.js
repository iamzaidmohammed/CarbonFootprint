const { scanUrl } = require("../services/ScannerService");
const { calculateEmissions } = require("../services/CalculatorService");
const { getRecommendations } = require("../services/RecommendationService");
const { checkGreenHosting } = require("../services/HostingService");
const Audit = require("../models/Audit");

const runAudit = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    // 1. Check if the hosting is green
    const hostingData = await checkGreenHosting(url);

    // 2. Scan the site
    const scanData = await scanUrl(url);

    // 3. Calculate emissions (Pass the real green status now!)
    const emissions = calculateEmissions(
      scanData.totalBytes,
      hostingData.isGreen,
    );

    const tips = getRecommendations(scanData);

    // 4. Save to Database (including hosting info)
    const newAudit = new Audit({
      url,
      dataTransfer: scanData,
      emissions: emissions,
      recommendations: tips,
      hosting: hostingData,
    });

    await newAudit.save();
    res.status(201).json(newAudit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await Audit.find().sort({ timestamp: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAuditById = async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit) return res.status(404).json({ error: "Audit not found" });
    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { runAudit, getHistory, getAuditById };
