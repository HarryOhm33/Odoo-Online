const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const Organization = require("../models/organization");

// GET organization details
router.get(
  "/",
  authenticate,
  wrapAsync(async (req, res) => {
    if (!req.user.organization) {
      return res.status(400).json({ message: "User does not belong to any organization." });
    }
    const organization = await Organization.findById(req.user.organization);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }
    res.status(200).json({ success: true, organization });
  })
);

// PUT update organization details (Admin only)
router.put(
  "/",
  authenticate,
  authorize("Admin"),
  wrapAsync(async (req, res) => {
    if (!req.user.organization) {
      return res.status(400).json({ message: "User does not belong to any organization." });
    }
    const { name, industry, address, status, logo } = req.body;
    
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: "Organization name cannot be empty." });
    }

    const organization = await Organization.findById(req.user.organization);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    if (name) organization.name = name.trim();
    if (industry !== undefined) organization.industry = industry ? industry.trim() : null;
    if (address !== undefined) organization.address = address ? address.trim() : null;
    if (status) organization.status = status;
    if (logo !== undefined) organization.logo = logo;

    await organization.save();

    res.status(200).json({ success: true, organization });
  })
);

module.exports = router;
