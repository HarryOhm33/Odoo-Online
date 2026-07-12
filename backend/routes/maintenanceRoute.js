const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const MaintenanceRequest = require("../models/maintenanceRequest");
const Asset = require("../models/asset");
const Notification = require("../models/notification");

// GET all maintenance requests scoped by organization
router.get(
  "/",
  authenticate,
  wrapAsync(async (req, res) => {
    let query = { organization: req.user.organization };
    if (req.user.role === "Employee") {
      query.reportedBy = req.user.id;
    }
    const requests = await MaintenanceRequest.find(query)
      .populate("asset", "name assetTag status")
      .populate("reportedBy", "name email");
    res.status(200).json({ success: true, requests });
  })
);

// POST create maintenance request
router.post(
  "/",
  authenticate,
  wrapAsync(async (req, res) => {
    const { assetId, title, description, priority, photo } = req.body;
    if (!assetId || !title) {
      return res.status(400).json({ message: "Asset and Title are required." });
    }

    const asset = await Asset.findOne({ _id: assetId, organization: req.user.organization });
    if (!asset) return res.status(404).json({ message: "Asset not found." });

    const request = await MaintenanceRequest.create({
      asset: assetId,
      reportedBy: req.user.id,
      organization: req.user.organization,
      title,
      description,
      priority: priority || "Medium",
      photo,
      status: "Pending",
    });

    res.status(201).json({ success: true, request });
  })
);

// PUT approve/reject/resolve request (AssetManager/Admin only)
router.put(
  "/:id/status",
  authenticate,
  authorize("AssetManager", "Admin"),
  wrapAsync(async (req, res) => {
    const { status, technicianName, notes } = req.body;
    const request = await MaintenanceRequest.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });

    if (!request) return res.status(404).json({ message: "Request not found." });

    request.status = status;
    if (technicianName) request.technicianName = technicianName;
    if (notes) request.notes = notes;

    const asset = await Asset.findById(request.asset);

    if (status === "Approved") {
      // Auto-updates asset status to Under Maintenance
      if (asset) {
        asset.status = "Under Maintenance";
        asset.maintenanceHistory.push({
          title: request.title,
          description: request.description,
          priority: request.priority,
          status: "Approved",
        });
        await asset.save();
      }
    } else if (status === "Resolved") {
      request.resolvedAt = new Date();
      // Reverts asset status back to Available
      if (asset) {
        asset.status = "Available";
        // Update history
        if (asset.maintenanceHistory.length > 0) {
          const lastEntry = asset.maintenanceHistory[asset.maintenanceHistory.length - 1];
          lastEntry.status = "Resolved";
          lastEntry.resolvedAt = new Date();
        }
        await asset.save();
      }
    }

    await request.save();

    // Notify user
    await Notification.create({
      user: request.reportedBy,
      organization: req.user.organization,
      message: `Your maintenance request for asset "${asset ? asset.name : ''}" has been updated to: ${status}.`,
      type: "MaintenanceUpdate",
    });

    res.status(200).json({ success: true, request });
  })
);

module.exports = router;
