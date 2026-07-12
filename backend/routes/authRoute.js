const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");

const {
  setup,
  login,
  logout,
  verify,
  activateAccount,
  verifySession,
  forgotPassword,
  forgotPasswordMobile,
  resetPassword,
  changePassword,
} = require("../controllers/auth");

// ── Organization + Admin Setup (one-time, no auth required) ─────────────────
router.post("/setup", wrapAsync(setup));

// ── Email Verification (legacy / kept for compatibility) ─────────────────────
router.post("/verify", wrapAsync(verify));

// ── Employee Account Activation ──────────────────────────────────────────────
router.post("/activate", wrapAsync(activateAccount));

// ── Login / Logout ───────────────────────────────────────────────────────────
router.post("/login", wrapAsync(login));
router.post("/logout", authenticate, wrapAsync(logout));

// ── Forgot / Reset / Change Password ─────────────────────────────────────────
router.post("/forgot-password", wrapAsync(forgotPassword));
router.post("/forgot-password-mobile", wrapAsync(forgotPasswordMobile));
router.post("/reset-password", wrapAsync(resetPassword));
router.put("/change-password", authenticate, wrapAsync(changePassword));

// ── Session Verification ─────────────────────────────────────────────────────
router.post("/verify-session", authenticate, wrapAsync(verifySession));

// ── Profile (protected) ──────────────────────────────────────────────────────
router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({ valid: true, message: "Welcome!", user: req.user });
});

module.exports = router;
