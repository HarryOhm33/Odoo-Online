const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceStatus,
} = require("../controllers/maintenance");

router.get("/", authenticate, wrapAsync(getMaintenanceRequests));
router.post("/", authenticate, wrapAsync(createMaintenanceRequest));
router.put("/:id/status", authenticate, authorize("AssetManager", "Admin"), wrapAsync(updateMaintenanceStatus));

module.exports = router;
