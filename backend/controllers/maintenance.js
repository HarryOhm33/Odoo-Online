const MaintenanceRequest = require("../models/maintenanceRequest");
const Asset = require("../models/asset");
const Notification = require("../models/notification");

module.exports.getMaintenanceRequests = async (req, res) => {
  let query = { organization: req.user.organization };
  if (req.user.role === "Employee") {
    query.reportedBy = req.user.id;
  }
  const requests = await MaintenanceRequest.find(query)
    .populate("asset", "name assetTag status")
    .populate("reportedBy", "name email");
  res.status(200).json({ success: true, requests });
};

module.exports.createMaintenanceRequest = async (req, res) => {
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
};

module.exports.updateMaintenanceStatus = async (req, res) => {
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
    if (asset) {
      asset.status = "Available";
      if (asset.maintenanceHistory.length > 0) {
        const lastEntry = asset.maintenanceHistory[asset.maintenanceHistory.length - 1];
        lastEntry.status = "Resolved";
        lastEntry.resolvedAt = new Date();
      }
      await asset.save();
    }
  }

  await request.save();

  await Notification.create({
    user: request.reportedBy,
    organization: req.user.organization,
    message: `Your maintenance request for asset "${asset ? asset.name : ''}" has been updated to: ${status}.`,
    type: "MaintenanceUpdate",
  });

  res.status(200).json({ success: true, request });
};
