const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const EmailToken = require("../models/emailToken");
const Organization = require("../models/organization");
const sendEmail = require("../utils/sendEmail");
const { generateActivationEmail } = require("../utils/mailTemplates");

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — Admin Creates an Employee
// POST /api/employees
// Access: Admin only  (authenticate + authorize("Admin") middleware)
// ─────────────────────────────────────────────────────────────────────────────
module.exports.createEmployee = async (req, res) => {
  const { name, email, department, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  // Validate role if provided
  const allowedRoles = ["Employee", "DepartmentHead", "AssetManager"];
  const assignedRole = role && allowedRoles.includes(role) ? role : "Employee";

  // Check duplicate email
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "A user with this email already exists." });
  }

  // Fetch org name for the activation email
  const organization = await Organization.findById(req.user.organization);

  // Create the user — password is null, not yet verified
  const employee = await User.create({
    name,
    email,
    password: null,
    isVerified: false,
    organization: req.user.organization,
    role: assignedRole,
    department: department || null,
    status: "Active",
    createdBy: req.user.id,
  });

  // Delete any old activation token for this email
  await EmailToken.deleteOne({ email, type: "activation" });

  // Generate a 24-hour activation token
  const token = crypto.randomBytes(32).toString("hex");
  await EmailToken.create({ email, token, type: "activation" });

  // Build the activation link
  const activationLink = `${process.env.FRONTEND_URL}/auth/activate?token=${token}&email=${encodeURIComponent(email)}`;

  const htmlContent = generateActivationEmail(
    name,
    activationLink,
    organization ? organization.name : ""
  );

  await sendEmail(email, "Activate Your Account", {
    text: `You have been added to ${organization ? organization.name : "the organization"}. Click the link to activate your account: ${activationLink}`,
    html: htmlContent,
  });

  return res.status(201).json({
    success: true,
    message: `Employee created. Activation email sent to ${email}.`,
    employee: {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      status: employee.status,
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Get all employees in the same organization
// GET /api/employees
// Access: Admin, DepartmentHead
// ─────────────────────────────────────────────────────────────────────────────
module.exports.getEmployees = async (req, res) => {
  // ✅ Organization scoping — NEVER query without org filter
  const employees = await User.find({ organization: req.user.organization })
    .select("-password")
    .populate("department", "name")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: employees.length,
    employees,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Get single employee
// GET /api/employees/:id
// Access: Admin, DepartmentHead
// ─────────────────────────────────────────────────────────────────────────────
module.exports.getEmployee = async (req, res) => {
  const employee = await User.findOne({
    _id: req.params.id,
    organization: req.user.organization, // ✅ scoped
  })
    .select("-password")
    .populate("department", "name");

  if (!employee) {
    return res.status(404).json({ message: "Employee not found." });
  }

  return res.status(200).json({ success: true, employee });
};

// ─────────────────────────────────────────────────────────────────────────────
// Update employee  (role, department, status)
// PUT /api/employees/:id
// Access: Admin only
// ─────────────────────────────────────────────────────────────────────────────
module.exports.updateEmployee = async (req, res) => {
  const { name, email, role, department, status } = req.body;

  const employee = await User.findOne({
    _id: req.params.id,
    organization: req.user.organization, // ✅ scoped
  });

  if (!employee) {
    return res.status(404).json({ message: "Employee not found." });
  }

  if (name) employee.name = name.trim();
  
  if (email) {
    const targetEmail = email.trim().toLowerCase();
    if (targetEmail !== employee.email.toLowerCase()) {
      const existing = await User.findOne({ email: targetEmail });
      if (existing) {
        return res.status(409).json({ message: "A user with this email already exists." });
      }
      employee.email = targetEmail;
    }
  }

  if (role) employee.role = role;
  if (department !== undefined) employee.department = department || null;
  if (status) employee.status = status;

  await employee.save();

  const { password: _, ...employeeData } = employee.toObject();

  return res.status(200).json({
    success: true,
    message: "Employee updated successfully.",
    employee: employeeData,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Resend activation email
// POST /api/employees/:id/resend-activation
// Access: Admin only
// ─────────────────────────────────────────────────────────────────────────────
module.exports.resendActivation = async (req, res) => {
  const employee = await User.findOne({
    _id: req.params.id,
    organization: req.user.organization, // ✅ scoped
  });

  if (!employee) {
    return res.status(404).json({ message: "Employee not found." });
  }

  if (employee.isVerified) {
    return res.status(400).json({ message: "Account is already activated." });
  }

  const organization = await Organization.findById(req.user.organization);

  // Delete old token and issue a new one
  await EmailToken.deleteOne({ email: employee.email, type: "activation" });
  const token = crypto.randomBytes(32).toString("hex");
  await EmailToken.create({ email: employee.email, token, type: "activation" });

  const activationLink = `${process.env.FRONTEND_URL}/auth/activate?token=${token}&email=${encodeURIComponent(employee.email)}`;
  const htmlContent = generateActivationEmail(
    employee.name,
    activationLink,
    organization ? organization.name : ""
  );

  await sendEmail(employee.email, "Activate Your Account", {
    text: `Activate your account: ${activationLink}`,
    html: htmlContent,
  });

  return res.status(200).json({
    success: true,
    message: `Activation email resent to ${employee.email}.`,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Deactivate / Delete an employee (soft delete → status: "Inactive")
// DELETE /api/employees/:id
// Access: Admin only
// ─────────────────────────────────────────────────────────────────────────────
module.exports.deleteEmployee = async (req, res) => {
  const employee = await User.findOne({
    _id: req.params.id,
    organization: req.user.organization,
  });

  if (!employee) {
    return res.status(404).json({ message: "Employee not found." });
  }

  // Prevent deleting yourself
  if (employee._id.toString() === req.user.id) {
    return res.status(400).json({ message: "You cannot deactivate your own account." });
  }

  // Prevent deleting another Admin
  if (employee.role === "Admin") {
    return res.status(400).json({ message: "Admin accounts cannot be deactivated this way." });
  }

  employee.status = "Inactive";
  await employee.save();

  return res.status(200).json({
    success: true,
    message: `Employee "${employee.name}" has been deactivated.`,
  });
};

