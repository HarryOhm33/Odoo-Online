const Transfer = require("../models/transfer");
const Asset = require("../models/asset");
const Notification = require("../models/notification");

module.exports.getTransfers = async (req, res) => {
  let query = { organization: req.user.organization };

  if (req.user.role === "Employee") {
    query.$or = [
      { fromUser: req.user.id },
      { requestedBy: req.user.id }
    ];
  } else if (req.user.role === "DepartmentHead") {
    // Dept head can see transfers involving them, or maybe their whole dept.
    // To keep it simple, just allow them to see what they requested or from them.
    query.$or = [
      { fromUser: req.user.id },
      { requestedBy: req.user.id }
    ];
  }

  const transfers = await Transfer.find(query)
    .populate("asset", "name assetTag")
    .populate("fromUser", "name email")
    .populate("toUser", "name email")
    .populate("toDepartment", "name")
    .populate("requestedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, transfers });
};

module.exports.createTransfer = async (req, res) => {
  const { assetId, toUser, toDepartment, reason } = req.body;

  if (!assetId || !reason) {
    return res.status(400).json({ message: "Asset and reason are required." });
  }

  if (!toUser && !toDepartment) {
    return res.status(400).json({ message: "Either a target user or target department must be selected." });
  }

  const asset = await Asset.findOne({
    _id: assetId,
    organization: req.user.organization
  });

  if (!asset) return res.status(404).json({ message: "Asset not found." });

  // Only allow transfer of assets currently assigned to the user (or allow Admins)
  if (asset.assignedTo?.toString() !== req.user.id && !["Admin", "AssetManager"].includes(req.user.role)) {
    return res.status(403).json({ message: "You can only request transfers for assets currently assigned to you." });
  }

  const existingPending = await Transfer.findOne({
    asset: assetId,
    status: "Pending",
    organization: req.user.organization
  });

  if (existingPending) {
    return res.status(409).json({ message: "A pending transfer request already exists for this asset." });
  }

  const isAutoApproved = ["Admin", "AssetManager"].includes(req.user.role);

  const transfer = await Transfer.create({
    asset: assetId,
    fromUser: asset.assignedTo || req.user.id,
    toUser: toUser || null,
    toDepartment: toDepartment || null,
    requestedBy: req.user.id,
    organization: req.user.organization,
    reason,
    status: isAutoApproved ? "Approved" : "Pending"
  });

  if (isAutoApproved) {
    if (asset.allocationHistory.length > 0) {
      const lastEntry = asset.allocationHistory[asset.allocationHistory.length - 1];
      if (!lastEntry.returnedAt) lastEntry.returnedAt = new Date();
    }
    
    asset.assignedTo = toUser || null;
    asset.department = toDepartment || null;
    asset.allocationHistory.push({
      assignedTo: toUser || null,
      department: toDepartment || null,
      assignedAt: new Date(),
    });
    
    await asset.save();
  }

  res.status(201).json({ success: true, transfer });
};

module.exports.approveTransfer = async (req, res) => {
  const transfer = await Transfer.findOne({
    _id: req.params.id,
    organization: req.user.organization
  }).populate("asset");

  if (!transfer) return res.status(404).json({ message: "Transfer request not found." });

  if (transfer.status !== "Pending") {
    return res.status(400).json({ message: `Transfer is already ${transfer.status.toLowerCase()}.` });
  }

  const asset = transfer.asset;

  // Mark old allocation as returned
  if (asset.allocationHistory.length > 0) {
    const lastEntry = asset.allocationHistory[asset.allocationHistory.length - 1];
    if (!lastEntry.returnedAt) {
      lastEntry.returnedAt = new Date();
    }
  }

  // Update asset allocation
  asset.assignedTo = transfer.toUser || null;
  asset.department = transfer.toDepartment || null;
  
  asset.allocationHistory.push({
    assignedTo: transfer.toUser || null,
    department: transfer.toDepartment || null,
    assignedAt: new Date(),
  });

  await asset.save();

  transfer.status = "Approved";
  await transfer.save();

  // Optionally send notification
  if (transfer.toUser) {
    await Notification.create({
      user: transfer.toUser,
      organization: req.user.organization,
      message: `Asset "${asset.name}" has been transferred to you.`,
      type: "AssetAssigned",
    });
  }

  res.status(200).json({ success: true, transfer });
};

module.exports.rejectTransfer = async (req, res) => {
  const transfer = await Transfer.findOne({
    _id: req.params.id,
    organization: req.user.organization
  });

  if (!transfer) return res.status(404).json({ message: "Transfer request not found." });

  if (transfer.status !== "Pending") {
    return res.status(400).json({ message: `Transfer is already ${transfer.status.toLowerCase()}.` });
  }

  transfer.status = "Rejected";
  await transfer.save();

  res.status(200).json({ success: true, transfer });
};
