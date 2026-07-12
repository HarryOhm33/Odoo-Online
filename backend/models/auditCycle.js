const mongoose = require("mongoose");

const auditedAssetSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  status: { type: String, enum: ["Verified", "Missing", "Damaged", "Pending"], default: "Pending" },
  notes: { type: String },
  auditedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  auditedAt: { type: Date },
});

const auditCycleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    scopeDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    scopeLocation: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    auditors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed", "Cancelled"],
      default: "Planned",
    },
    auditedAssets: [auditedAssetSchema],
    discrepancyReport: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditCycle", auditCycleSchema);
