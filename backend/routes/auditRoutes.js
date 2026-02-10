const express = require("express");
const router = express.Router();
const { runAudit, getHistory } = require("../controllers/AuditController");

// route for scanning
router.post("/audit", runAudit);

// route for fetching history
router.get("/history", getHistory);

module.exports = router;
