const Notification = require("../models/notification");

module.exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    user: req.user.id,
    organization: req.user.organization,
  }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, notifications });
};

module.exports.readNotification = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id, organization: req.user.organization },
    { isRead: true },
    { new: true }
  );

  if (!notification) return res.status(404).json({ message: "Notification not found." });
  res.status(200).json({ success: true, notification });
};

module.exports.readAllNotifications = async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, organization: req.user.organization, isRead: false },
    { isRead: true }
  );
  res.status(200).json({ success: true });
};
