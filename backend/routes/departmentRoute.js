const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const Department = require("../models/department");

// GET all departments scoped by organization
router.get(
  "/",
  authenticate,
  wrapAsync(async (req, res) => {
    const departments = await Department.find({ organization: req.user.organization })
      .populate("head", "name email")
      .populate("parentDepartment", "name");
    res.status(200).json({ success: true, departments });
  })
);

// POST create department (Admin only)
router.post(
  "/",
  authenticate,
  authorize("Admin"),
  wrapAsync(async (req, res) => {
    const { name, code, head, parentDepartment, status } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required." });
    if (!code) return res.status(400).json({ message: "Department code is required." });

    // Check for duplicate code in the same organization
    const existing = await Department.findOne({
      organization: req.user.organization,
      code: code.trim(),
    });
    if (existing) {
      return res.status(400).json({ message: "Department code already exists in this organization." });
    }

    const department = await Department.create({
      name,
      code: code.trim(),
      organization: req.user.organization,
      head: head || null,
      parentDepartment: parentDepartment || null,
      status: status || "Active",
    });

    res.status(201).json({ success: true, department });
  })
);

// PUT update department (Admin only)
router.put(
  "/:id",
  authenticate,
  authorize("Admin"),
  wrapAsync(async (req, res) => {
    const { name, code, head, parentDepartment, status } = req.body;
    const department = await Department.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });

    if (!department) return res.status(404).json({ message: "Department not found." });

    if (name) department.name = name;
    if (code) {
      const existing = await Department.findOne({
        organization: req.user.organization,
        code: code.trim(),
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res.status(400).json({ message: "Department code already exists in this organization." });
      }
      department.code = code.trim();
    }
    if (head !== undefined) department.head = head || null;
    if (parentDepartment !== undefined) department.parentDepartment = parentDepartment || null;
    if (status) department.status = status;

    await department.save();
    res.status(200).json({ success: true, department });
  })
);

module.exports = router;
