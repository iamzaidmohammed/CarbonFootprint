const { scanUrl } = require("../services/ScannerService");
const { calculateEmissions } = require("../services/CalculatorService");
const Audit = require("../models/Audit"); // Import the MongoDB Model

const runAudit = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    // 1. Perform the scan
    const scanData = await scanUrl(url);

    // 2. Calculate the carbon metrics
    const emissions = calculateEmissions(scanData.totalBytes, false);

    // 3. CREATE: Save the result to MongoDB
    const newAudit = new Audit({
      url,
      dataTransfer: scanData,
      emissions: emissions,
    });

    const savedAudit = await newAudit.save();

    // 4. Return the saved document
    res.status(201).json(savedAudit);
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
