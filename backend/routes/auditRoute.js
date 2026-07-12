const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const AuditCycle = require("../models/auditCycle");
const Asset = require("../models/asset");

// GET all audit cycles scoped by organization
router.get(
  "/",
  authenticate,
  wrapAsync(async (req, res) => {
    const audits = await AuditCycle.find({ organization: req.user.organization })
      .populate("auditors", "name email")
      .populate("scopeDepartment", "name")
      .populate("auditedAssets.asset", "name assetTag status");
    res.status(200).json({ success: true, audits });
  })
);

// POST create audit cycle (Admin/AssetManager only)
router.post(
  "/",
  authenticate,
  authorize("Admin", "AssetManager"),
  wrapAsync(async (req, res) => {
    const { title, scopeDepartment, scopeLocation, startDate, endDate, auditors } = req.body;
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: "Title, start date, and end date are required." });
    }

    // Populate scope assets automatically
    let query = { organization: req.user.organization };
    if (scopeDepartment) query.department = scopeDepartment;
    if (scopeLocation) query.location = scopeLocation;

    const assets = await Asset.find(query);
    const auditedAssets = assets.map((a) => ({
      asset: a._id,
      status: "Pending",
    }));

    const audit = await AuditCycle.create({
      title,
      organization: req.user.organization,
      scopeDepartment: scopeDepartment || null,
      scopeLocation: scopeLocation || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      auditors: auditors || [],
      status: "Planned",
      auditedAssets,
    });

    res.status(201).json({ success: true, audit });
  })
);

// PUT auditor marks asset status
router.put(
  "/:id/asset/:assetId",
  authenticate,
  wrapAsync(async (req, res) => {
    const { status, notes } = req.body; // Verified | Missing | Damaged
    if (!status) return res.status(400).json({ message: "Status is required." });

    const audit = await AuditCycle.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });

    if (!audit) return res.status(404).json({ message: "Audit cycle not found." });

    // Verify user is an assigned auditor or Admin
    if (!audit.auditors.includes(req.user.id) && !["Admin", "AssetManager"].includes(req.user.role)) {
      return res.status(403).json({ message: "You are not authorized to perform audits on this cycle." });
    }

    const item = audit.auditedAssets.find((a) => a.asset.toString() === req.params.assetId);
    if (!item) return res.status(404).json({ message: "Asset not in audit scope." });

    item.status = status;
    item.notes = notes;
    item.auditedBy = req.user.id;
    item.auditedAt = new Date();

    await audit.save();
    res.status(200).json({ success: true, audit });
  })
);

// POST close audit cycle & auto-generate discrepancy report & update missing asset statuses to Lost
router.post(
  "/:id/close",
  authenticate,
  authorize("Admin", "AssetManager"),
  wrapAsync(async (req, res) => {
    const audit = await AuditCycle.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });

    if (!audit) return res.status(404).json({ message: "Audit cycle not found." });

    audit.status = "Completed";

    let missingCount = 0;
    let damagedCount = 0;
    let verifiedCount = 0;

    for (const item of audit.auditedAssets) {
      if (item.status === "Missing") {
        missingCount++;
        // Update asset status to Lost
        await Asset.findByIdAndUpdate(item.asset, { status: "Lost" });
      } else if (item.status === "Damaged") {
        damagedCount++;
      } else if (item.status === "Verified") {
        verifiedCount++;
      }
    }

    audit.discrepancyReport = `Audit closed on ${new Date().toLocaleDateString()}. Results: ${verifiedCount} Verified, ${missingCount} Missing, ${damagedCount} Damaged. Missing assets have been flagged as "Lost" in the system.`;

    await audit.save();
    res.status(200).json({ success: true, audit });
  })
);

module.exports = router;
