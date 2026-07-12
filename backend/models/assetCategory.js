const mongoose = require("mongoose");

const assetCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    description: { type: String, trim: true },
    // Category-specific fields (e.g. custom attributes like warranty period)
    customFields: [
      {
        name: { type: String, required: true },
        type: { type: String, enum: ["text", "number", "boolean", "date"], default: "text" },
        required: { type: Boolean, default: false },
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssetCategory", assetCategorySchema);
