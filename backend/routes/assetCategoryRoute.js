const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const AssetCategory = require("../models/assetCategory");

// GET all asset categories scoped by organization
router.get(
  "/",
  authenticate,
  wrapAsync(async (req, res) => {
    const categories = await AssetCategory.find({ organization: req.user.organization });
    res.status(200).json({ success: true, categories });
  })
);

// POST create category (Admin only)
router.post(
  "/",
  authenticate,
  authorize("Admin"),
  wrapAsync(async (req, res) => {
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
  })
);

// PUT update category (Admin only)
router.put(
  "/:id",
  authenticate,
  authorize("Admin"),
  wrapAsync(async (req, res) => {
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
  })
);

module.exports = router;
