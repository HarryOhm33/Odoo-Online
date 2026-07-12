const AssetCategory = require("../models/assetCategory");

module.exports.getCategories = async (req, res) => {
  const categories = await AssetCategory.find({ organization: req.user.organization });
  res.status(200).json({ success: true, categories });
};

module.exports.createCategory = async (req, res) => {
  const { name, description, customFields, status } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required." });

  const category = await AssetCategory.create({
    name,
    organization: req.user.organization,
    description,
    customFields: customFields || [],
    status: status || "Active",
  });

  res.status(201).json({ success: true, category });
};

module.exports.updateCategory = async (req, res) => {
  const { name, description, customFields, status } = req.body;
  const category = await AssetCategory.findOne({
    _id: req.params.id,
    organization: req.user.organization,
  });

  if (!category) return res.status(404).json({ message: "Category not found." });

  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  if (customFields) category.customFields = customFields;
  if (status) category.status = status;

  await category.save();
  res.status(200).json({ success: true, category });
};

module.exports.deleteCategory = async (req, res) => {
  const Asset = require("../models/asset");
  const category = await AssetCategory.findOne({
    _id: req.params.id,
    organization: req.user.organization,
  });

  if (!category) return res.status(404).json({ message: "Category not found." });

  const assetCount = await Asset.countDocuments({ category: req.params.id });
  if (assetCount > 0) {
    return res.status(400).json({
      message: `Cannot delete category "${category.name}" — it has ${assetCount} asset(s) assigned. Reassign them first.`,
    });
  }

  await AssetCategory.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, message: `Category "${category.name}" deleted.` });
};
