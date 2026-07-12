const mongoose = require("mongoose");

const emailTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },

  // Distinguishes token purpose:
  //   "verification" — email verify after signup
  //   "activation"   — employee account activation (set password)
  //   "reset"        — forgot password reset
  type: {
    type: String,
    enum: ["verification", "activation", "reset"],
    default: "verification",
  },

  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours (activation links live longer)
  },
});

// TTL index — MongoDB auto-deletes expired tokens
emailTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("EmailToken", emailTokenSchema);
