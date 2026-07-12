const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const Notification = require("../models/notification");

// GET notifications for current user
router.get(
  "/",
  authenticate,
  wrapAsync(async (req, res) => {
    const notifications = await Notification.find({
      user: req.user.id,
      organization: req.user.organization,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  })
);

// PUT mark notification as read
router.put(
  "/:id/read",
  authenticate,
  wrapAsync(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, organization: req.user.organization },
      { isRead: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: "Notification not found." });
    res.status(200).json({ success: true, notification });
  })
);

// PUT mark all as read
router.put(
  "/read-all",
  authenticate,
  wrapAsync(async (req, res) => {
    await Notification.updateMany(
      { user: req.user.id, organization: req.user.organization, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ success: true });
  })
);

module.exports = router;
