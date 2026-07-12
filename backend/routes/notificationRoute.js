const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const {
  getNotifications,
  readNotification,
  readAllNotifications,
} = require("../controllers/notification");

router.get("/", authenticate, wrapAsync(getNotifications));
router.put("/:id/read", authenticate, wrapAsync(readNotification));
router.put("/read-all", authenticate, wrapAsync(readAllNotifications));

module.exports = router;
