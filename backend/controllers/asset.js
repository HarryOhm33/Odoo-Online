const Asset = require("../models/asset");
const User = require("../models/user");
const Notification = require("../models/notification");

module.exports.getAssets = async (req, res) => {
  let query = { organization: req.user.organization };

  if (req.user.role === "Employee") {
    query.assignedTo = req.user.id;
  } else if (req.user.role === "DepartmentHead") {
    const me = await User.findById(req.user.id);
    if (me?.department) {
      query.$or = [
        { department: me.department },
        { assignedTo: req.user.id }
      ];
    } else {
      query.assignedTo = req.user.id;
    }
  }

  const assets = await Asset.find(query)
    .populate("category", "name")
    .populate("assignedTo", "name email")
    .populate("department", "name");

  res.status(200).json({ success: true, assets });
};

module.exports.createAsset = async (req, res) => {
  const { name, category, serialNumber, acquisitionDate, acquisitionCost, condition, location, photo, sharedBookable, customAttributes } = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: "Name and Category are required." });
  }

  const count = await Asset.countDocuments({ organization: req.user.organization });
  const tagNum = String(count + 1).padStart(4, "0");
  const assetTag = `AF-${tagNum}`;

  const asset = await Asset.create({
    name,
    category,
    organization: req.user.organization,
    assetTag,
    serialNumber,
    acquisitionDate,
    acquisitionCost,
    condition: condition || "Good",
    location,
    photo,
    sharedBookable: !!sharedBookable,
    customAttributes: customAttributes || {},
    status: "Available",
  });

  res.status(201).json({ success: true, asset });
};

module.exports.allocateAsset = async (req, res) => {
  const { assignedTo, department, expectedReturnDate } = req.body;
  const asset = await Asset.findOne({
    _id: req.params.id,
    organization: req.user.organization,
  }).populate("assignedTo", "name");

  if (!asset) return res.status(404).json({ message: "Asset not found." });

  if (asset.status === "Allocated") {
    return res.status(409).json({
      message: `This asset is already allocated.`,
      currentlyHeldBy: asset.assignedTo?.name || "another user",
      canRequestTransfer: true,
    });
  }

  asset.status = "Allocated";
  asset.assignedTo = assignedTo || null;
  asset.department = department || null;
  asset.expectedReturnDate = expectedReturnDate ? new Date(expectedReturnDate) : null;

  asset.allocationHistory.push({
    assignedTo: assignedTo || null,
    department: department || null,
    assignedAt: new Date(),
  });

  await asset.save();

  if (assignedTo) {
    await Notification.create({
      user: assignedTo,
      organization: req.user.organization,
      message: `Asset "${asset.name}" (${asset.assetTag}) has been allocated to you.`,
      type: "AssetAssigned",
    });
  }

  res.status(200).json({ success: true, asset });
};

module.exports.returnAsset = async (req, res) => {
  const { conditionAtCheckIn } = req.body;
  const asset = await Asset.findOne({
    _id: req.params.id,
    organization: req.user.organization,
  });

  if (!asset) return res.status(404).json({ message: "Asset not found." });

  const previousUser = asset.assignedTo;

  if (asset.allocationHistory.length > 0) {
    const lastEntry = asset.allocationHistory[asset.allocationHistory.length - 1];
    if (!lastEntry.returnedAt) {
      lastEntry.returnedAt = new Date();
      lastEntry.conditionAtCheckIn = conditionAtCheckIn || asset.condition;
    }
  }

  asset.status = "Available";
  asset.assignedTo = null;
  asset.department = null;
  asset.expectedReturnDate = null;
  if (conditionAtCheckIn) asset.condition = conditionAtCheckIn;

  await asset.save();

  if (previousUser) {
    await Notification.create({
      user: previousUser,
      organization: req.user.organization,
      message: `Asset "${asset.name}" has been successfully returned.`,
      type: "AssetReturned",
    });
  }

  res.status(200).json({ success: true, asset });
};
