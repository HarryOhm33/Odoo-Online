const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user");
const Session = require("../models/session");
const EmailToken = require("../models/emailToken");
const Organization = require("../models/organization");

const sendEmail = require("../utils/sendEmail");
const {
  generateVerificationEmail,
  generatePasswordResetEmail,
} = require("../utils/mailTemplates");

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — One-time Organization + Admin Setup
// POST /api/auth/setup
// ─────────────────────────────────────────────────────────────────────────────
module.exports.setup = async (req, res) => {
  // Check if an organization already exists
  const existingOrg = await Organization.findOne();
  if (existingOrg) {
    return res
      .status(409)
      .json({ message: "Organization already initialized." });
  }

  const { orgName, orgIndustry, orgAddress, name, email, password } = req.body;

  if (!orgName || !name || !email || !password) {
    return res.status(400).json({
      message: "orgName, name, email, and password are required.",
    });
  }

  // Hash the admin password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the admin user first (without org yet, we'll update after)
  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false, // Admin must verify email first
    role: "Admin",
    status: "Active",
  });

  // Create the organization, referencing the admin as createdBy
  const organization = await Organization.create({
    name: orgName,
    industry: orgIndustry || null,
    address: orgAddress || null,
    createdBy: admin._id,
    status: "Active",
  });

  // Link the admin back to the organization
  admin.organization = organization._id;
  await admin.save();

  // Create email token for verification
  const tokenVal = crypto.randomBytes(32).toString("hex");
  await EmailToken.create({
    email,
    token: tokenVal,
    type: "verification",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
  });

  // Send verification email
  const verificationLink = `${process.env.FRONTEND_URL}/auth/verify?token=${tokenVal}&email=${encodeURIComponent(email)}`;
  const htmlContent = generateVerificationEmail(name, verificationLink);

  await sendEmail(email, "Verify Your Admin Account", {
    text: "Please verify your admin email address.",
    html: htmlContent,
  });

  return res.status(201).json({
    success: true,
    message: "Organization created! Please verify your email address to activate your admin account.",
  });
};



// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Login (slim JWT payload)
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
    .populate("organization")
    .populate("department", "name");

  if (!user)
    return res.status(400).json({ message: "User not found. Contact your administrator." });

  if (!user.isVerified)
    return res.status(403).json({ message: "Account not yet activated. Please check your email for the activation link." });

  if (user.status === "Inactive")
    return res.status(403).json({ message: "Your account has been deactivated. Contact your administrator." });

  if (!user.password)
    return res.status(403).json({ message: "Account not activated. Please check your email for the activation link." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

  // ✅ Slim JWT payload — only store id, organization, role
  const payload = {
    id: user._id,
    organization: user.organization,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  // ✅ Store session in MongoDB
  await Session.create({ userId: user._id, token });

  // ✅ Set token in HTTP-only cookie
  res.cookie("autoKey", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Return user details separately (never expose password)
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      department: user.department,
      status: user.status,
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — Verify Session
// POST /api/auth/verify-session  (authenticate middleware required)
// ─────────────────────────────────────────────────────────────────────────────
module.exports.verifySession = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user.id)
    .select("-password")
    .populate("organization", "name logo industry address status createdAt")
    .populate("department", "name");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      department: user.department,
      status: user.status,
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Logout
// POST /api/auth/logout  (authenticate middleware required)
// ─────────────────────────────────────────────────────────────────────────────
module.exports.logout = async (req, res) => {
  // ✅ Delete the session from MongoDB
  await Session.deleteOne({ userId: req.user.id, token: req.token });

  // ✅ Clear the authentication cookie
  res.clearCookie("autoKey", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 — Employee Account Activation
// POST /api/auth/activate
// Body: { token, password }
// ─────────────────────────────────────────────────────────────────────────────
module.exports.activateAccount = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required." });
  }

  const record = await EmailToken.findOne({ token, type: "activation" });
  if (!record) {
    return res.status(400).json({ message: "Invalid or expired activation link." });
  }

  const user = await User.findOne({ email: record.email });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Account is already activated." });
  }

  // Hash the new password and activate the account
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.isVerified = true;
  user.status = "Active";
  await user.save();

  // Delete the activation token after use
  await EmailToken.deleteOne({ token, type: "activation" });

  return res.status(200).json({
    success: true,
    message: "Account activated successfully. You can now log in.",
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Email Verification (kept for legacy flows)
// POST /api/auth/verify
// ─────────────────────────────────────────────────────────────────────────────
module.exports.verify = async (req, res) => {
  const { token, email } = req.body;

  if (!token || !email)
    return res.status(400).json({ message: "Token is required" });

  const record = await EmailToken.findOne({ token, email });

  if (!record) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const user = await User.findOne({ email: record.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isVerified = true;
  if (user.status === "Inactive") {
    user.status = "Active";
  }
  await user.save();

  // ✅ Delete email token after successful verification
  await EmailToken.deleteOne({ token, email });

  return res
    .status(200)
    .json({ success: true, message: "Verification successful. You can now log in." });
};

// ─────────────────────────────────────────────────────────────────────────────
// Forgot Password
// POST /api/auth/forgot-password
// ─────────────────────────────────────────────────────────────────────────────
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  // Delete old reset tokens
  await EmailToken.deleteOne({ email, type: "reset" });

  const token = crypto.randomBytes(32).toString("hex");
  await EmailToken.create({ email, token, type: "reset" });

  const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  const htmlContent = generatePasswordResetEmail(user.name, resetLink);

  await sendEmail(email, "Reset Your Password", {
    text: "You requested to reset your password.",
    html: htmlContent,
  });

  return res
    .status(200)
    .json({ success: true, message: "Password reset link sent to email" });
};

// ─────────────────────────────────────────────────────────────────────────────
// Forgot Password (Mobile deep-link)
// POST /api/auth/forgot-password-mobile
// ─────────────────────────────────────────────────────────────────────────────
module.exports.forgotPasswordMobile = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  await EmailToken.deleteOne({ email, type: "reset" });

  const token = crypto.randomBytes(32).toString("hex");
  await EmailToken.create({ email, token, type: "reset" });

  const resetLink = `auth-app://reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  const htmlContent = generatePasswordResetEmail(user.name, resetLink);

  await sendEmail(email, "Reset Your Password", {
    text: "You requested to reset your password.",
    html: htmlContent,
  });

  return res
    .status(200)
    .json({ success: true, message: "Password reset link sent to email" });
};

// ─────────────────────────────────────────────────────────────────────────────
// Reset Password
// POST /api/auth/reset-password
// ─────────────────────────────────────────────────────────────────────────────
module.exports.resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  if (!token || !email || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const record = await EmailToken.findOne({ token, email, type: "reset" });
  if (!record)
    return res.status(400).json({ message: "Invalid or expired token" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  // Delete token after reset
  await EmailToken.deleteOne({ token, email, type: "reset" });

  return res.status(200).json({
    success: true,
    message: "Password reset successful. Please log in.",
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Change Password (Authenticated user changes their own password)
// PUT /api/auth/change-password
// ─────────────────────────────────────────────────────────────────────────────
module.exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new passwords are required." });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect current password." });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Update Profile (Authenticated user updates their own profile)
// PUT /api/auth/profile
// ─────────────────────────────────────────────────────────────────────────────
module.exports.updateProfile = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Name is required." });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.name = name.trim();
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      department: user.department,
      status: user.status,
    }
  });
};
