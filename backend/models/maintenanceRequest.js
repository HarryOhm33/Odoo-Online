const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Technician Assigned", "In Progress", "Resolved"],
      default: "Pending",
    },
    photo: { type: String },
    technicianName: { type: String, trim: true },
    notes: { type: String, trim: true },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
