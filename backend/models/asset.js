const mongoose = require("mongoose");

const allocationHistorySchema = new mongoose.Schema({
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  assignedAt: { type: Date, default: Date.now },
  returnedAt: { type: Date },
  conditionAtCheckIn: { type: String },
});

const maintenanceHistorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Approved", "Rejected", "Technician Assigned", "In Progress", "Resolved"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
});

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetCategory",
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    assetTag: { type: String, unique: true },
    serialNumber: { type: String, trim: true },
    acquisitionDate: { type: Date },
    acquisitionCost: { type: Number },
    condition: {
      type: String,
      enum: ["New", "Good", "Fair", "Poor"],
      default: "Good",
    },
    location: { type: String, trim: true },
    photo: { type: String },
    sharedBookable: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"],
      default: "Available",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    expectedReturnDate: { type: Date },
    // Dynamic attributes for category-specific fields
    customAttributes: { type: Map, of: String },

    allocationHistory: [allocationHistorySchema],
    maintenanceHistory: [maintenanceHistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);
