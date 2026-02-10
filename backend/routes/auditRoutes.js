const express = require("express");
const router = express.Router();
const { runAudit } = require("../controllers/AuditController");

// POST request to /api/audit
router.post("/audit", runAudit);

module.exports = router;
