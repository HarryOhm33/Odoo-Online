const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getAssets,
  createAsset,
  allocateAsset,
  returnAsset,
  updateAsset,
} = require("../controllers/asset");

router.get("/", authenticate, wrapAsync(getAssets));
router.post("/", authenticate, authorize("AssetManager", "Admin"), wrapAsync(createAsset));
router.put("/:id", authenticate, authorize("AssetManager", "Admin"), wrapAsync(updateAsset));
router.post("/:id/allocate", authenticate, authorize("AssetManager", "Admin"), wrapAsync(allocateAsset));
router.post("/:id/return", authenticate, authorize("AssetManager", "Admin"), wrapAsync(returnAsset));

module.exports = router;
