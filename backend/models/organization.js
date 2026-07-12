const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    logo:     { type: String, default: null },
    industry: { type: String, default: null },
    address:  { type: String, default: null },
    email:    { type: String, default: null, trim: true, lowercase: true },
    phone:    { type: String, default: null, trim: true },
    website:  { type: String, default: null, trim: true },
    timezone: { type: String, default: "UTC" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);
module.exports = Organization;
