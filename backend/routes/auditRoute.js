const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getAudits,
  createAudit,
  updateAuditAssetStatus,
  closeAudit,
} = require("../controllers/audit");

router.get("/", authenticate, wrapAsync(getAudits));
router.post("/", authenticate, authorize("Admin", "AssetManager"), wrapAsync(createAudit));
router.put("/:id/asset/:assetId", authenticate, wrapAsync(updateAuditAssetStatus));
router.post("/:id/close", authenticate, authorize("Admin", "AssetManager"), wrapAsync(closeAudit));

module.exports = router;
