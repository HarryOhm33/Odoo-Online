const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");

const {
  setup,
  signup,
  login,
  logout,
  verify,
  activateAccount,
  verifySession,
  forgotPassword,
  forgotPasswordMobile,
  resetPassword,
} = require("../controllers/auth");

// ── Organization + Admin Setup (one-time, no auth required) ─────────────────
router.post("/setup", wrapAsync(setup));

// ── Employee Signup (no role selection) ──────────────────────────────────────
router.post("/signup", wrapAsync(signup));

// ── Email Verification (legacy / kept for compatibility) ─────────────────────
router.post("/verify", wrapAsync(verify));

// ── Employee Account Activation ──────────────────────────────────────────────
router.post("/activate", wrapAsync(activateAccount));

// ── Login / Logout ───────────────────────────────────────────────────────────
router.post("/login", wrapAsync(login));
router.post("/logout", authenticate, wrapAsync(logout));

// ── Forgot / Reset Password ──────────────────────────────────────────────────
router.post("/forgot-password", wrapAsync(forgotPassword));
router.post("/forgot-password-mobile", wrapAsync(forgotPasswordMobile));
router.post("/reset-password", wrapAsync(resetPassword));

// ── Session Verification ─────────────────────────────────────────────────────
router.post("/verify-session", authenticate, wrapAsync(verifySession));

// ── Profile (protected) ──────────────────────────────────────────────────────
router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({ valid: true, message: "Welcome!", user: req.user });
});

module.exports = router;
