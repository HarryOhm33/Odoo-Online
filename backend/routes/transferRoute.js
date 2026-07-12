const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getTransfers,
  createTransfer,
  approveTransfer,
  rejectTransfer,
} = require("../controllers/transfer");

router.get("/", authenticate, wrapAsync(getTransfers));
router.post("/", authenticate, wrapAsync(createTransfer));

// Only Asset Managers and Admins can approve or reject transfers
router.put("/:id/approve", authenticate, authorize("AssetManager", "Admin"), wrapAsync(approveTransfer));
router.put("/:id/reject", authenticate, authorize("AssetManager", "Admin"), wrapAsync(rejectTransfer));

module.exports = router;
