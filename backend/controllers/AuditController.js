const { scanUrl } = require("../services/ScannerService");
const { calculateEmissions } = require("../services/CalculatorService");
const { getRecommendations } = require("../services/RecommendationService");
const { checkGreenHosting } = require("../services/HostingService");
const Audit = require("../models/Audit");

const runAudit = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    console.log(`Starting secure audit process for: ${url}`);

    // 1. Scan the site first (Headless operations should always have high network priority)
    let scanData;
    try {
      scanData = await scanUrl(url);
    } catch (scanError) {
      console.error("ScannerService failed:", scanError.message);
      return res.status(500).json({
        error:
          "Failed to scan target website. The server may have rejected the automated connection.",
        details: scanError.message,
      });
    }

    // Double check that we actually gathered network data
    if (!scanData || scanData.totalBytes === 0) {
      return res.status(422).json({
        error:
          "Audit incomplete. The website returned 0 bytes, indicating it blocked our request.",
      });
    }

    // 2. Check if the hosting is green (with fallback safety)
    let hostingData = {
      isGreen: false,
      provider: "Unknown Provider",
      note: "Verification process bypassed due to routing issue.",
    };
    try {
      hostingData = await checkGreenHosting(url);
    } catch (hostingError) {
      console.warn(
        "Hosting verification failed gracefully:",
        hostingError.message,
      );
      // We don't crash the audit if just the hosting lookup fails; we proceed with default non-green status
    }

    // 3. Calculate emissions using real green status
    const emissions = calculateEmissions(
      scanData.totalBytes,
      hostingData.isGreen,
    );

    // 4. Extract refactoring suggestions based on weights
    const tips = getRecommendations(scanData);

    // 5. Save to Database (including hosting info and fallback notes)
    const newAudit = new Audit({
      url,
      dataTransfer: scanData,
      emissions: emissions,
      recommendations: tips,
      hosting: {
        isGreen: hostingData.isGreen,
        provider: hostingData.provider,
        note: hostingData.note || "No verification notes provided.",
      },
    });

    await newAudit.save();
    res.status(201).json(newAudit);
  } catch (error) {
    console.error("Unhandled Exception in runAudit:", error.message);
    res
      .status(500)
      .json({
        error: "An internal server error occurred during the audit.",
        details: error.message,
      });
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
