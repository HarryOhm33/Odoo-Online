const Department = require("../models/department");
const User = require("../models/user");
const Asset = require("../models/asset");

module.exports.getDepartments = async (req, res) => {
  const departments = await Department.find({ organization: req.user.organization })
    .populate("head", "name email")
    .populate("parentDepartment", "name")
    .sort({ name: 1 });

  // Enrich with employeeCount and assetCount
  const orgId = req.user.organization;
  const deptIds = departments.map((d) => d._id);

  const [empCounts, assetCounts] = await Promise.all([
    User.aggregate([
      { $match: { organization: orgId, department: { $in: deptIds } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]),
    Asset.aggregate([
      { $match: { organization: orgId, department: { $in: deptIds } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]),
  ]);

  const empMap   = Object.fromEntries(empCounts.map((e)   => [e._id.toString(), e.count]));
  const assetMap = Object.fromEntries(assetCounts.map((a) => [a._id.toString(), a.count]));

  const enriched = departments.map((d) => ({
    ...d.toObject(),
    employeeCount: empMap[d._id.toString()]   || 0,
    assetCount:    assetMap[d._id.toString()] || 0,
  }));

  res.status(200).json({ success: true, departments: enriched });
};

module.exports.createDepartment = async (req, res) => {
  const { name, code, head, parentDepartment, status } = req.body;
  if (!name || !code) {
    return res.status(400).json({ message: "Name and Code are required." });
  }

  // Check for duplicate code within org
  const existing = await Department.findOne({ code: code.trim(), organization: req.user.organization });
  if (existing) {
    return res.status(409).json({ message: `Department code "${code}" is already in use.` });
  }

  const department = await Department.create({
    name:             name.trim(),
    code:             code.trim().toUpperCase(),
    organization:     req.user.organization,
    head:             head || null,
    parentDepartment: parentDepartment || null,
    status:           status || "Active",
  });

  res.status(201).json({ success: true, department });
};

module.exports.updateDepartment = async (req, res) => {
  const { name, code, head, parentDepartment, status } = req.body;
  const department = await Department.findOne({
    _id: req.params.id,
    organization: req.user.organization,
  });

  if (!department) return res.status(404).json({ message: "Department not found." });

  if (name) department.name = name.trim();
  if (code) {
    const dup = await Department.findOne({
      code: code.trim(),
      organization: req.user.organization,
      _id: { $ne: req.params.id },
    });
    if (dup) return res.status(409).json({ message: `Department code "${code}" is already in use.` });
    department.code = code.trim().toUpperCase();
  }
  if (head             !== undefined) department.head             = head || null;
  if (parentDepartment !== undefined) department.parentDepartment = parentDepartment || null;
  if (status)                         department.status           = status;

  await department.save();
  res.status(200).json({ success: true, department });
};

module.exports.deleteDepartment = async (req, res) => {
  const department = await Department.findOne({
    _id: req.params.id,
    organization: req.user.organization,
  });

  if (!department) return res.status(404).json({ message: "Department not found." });

  // Check if employees are assigned to this department
  const empCount = await User.countDocuments({ department: req.params.id });
  if (empCount > 0) {
    return res.status(400).json({
      message: `Cannot delete department "${department.name}" — it has ${empCount} employee(s) assigned. Reassign or remove them first.`,
    });
  }

  await Department.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, message: `Department "${department.name}" deleted successfully.` });
};
