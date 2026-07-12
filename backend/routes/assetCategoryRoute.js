const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/assetCategory");

router.get("/", authenticate, wrapAsync(getCategories));
router.post("/", authenticate, authorize("Admin"), wrapAsync(createCategory));
router.put("/:id", authenticate, authorize("Admin"), wrapAsync(updateCategory));
router.delete("/:id", authenticate, authorize("Admin"), wrapAsync(deleteCategory));

module.exports = router;
