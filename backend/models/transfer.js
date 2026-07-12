const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transferSchema = new Schema(
  {
    asset: {
      type: Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    toDepartment: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Transfer = mongoose.model("Transfer", transferSchema);
module.exports = Transfer;
