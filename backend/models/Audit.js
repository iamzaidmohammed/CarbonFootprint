const mongoose = require("mongoose");

const AuditSchema = new mongoose.Schema({
  url: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  dataTransfer: {
    totalBytes: Number,
    images: Number,
    scripts: Number,
    css: Number,
    other: Number,
  },
  emissions: {
    co2Grams: Number,
    energyKwh: Number,
    grade: String,
  },
  recommendations: [
    {
      type: { type: String },
      priority: { type: String },
      message: { type: String },
      action: { type: String },
    },
  ],
});

module.exports = mongoose.model("Audit", AuditSchema);
