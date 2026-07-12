const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const Booking = require("../models/booking");
const Asset = require("../models/asset");

// GET bookings scoped by organization
router.get(
  "/",
  authenticate,
  wrapAsync(async (req, res) => {
    const bookings = await Booking.find({ organization: req.user.organization })
      .populate("asset", "name assetTag")
      .populate("user", "name email");
    res.status(200).json({ success: true, bookings });
  })
);

// POST create booking with overlap validation
router.post(
  "/",
  authenticate,
  wrapAsync(async (req, res) => {
    const { assetId, startDate, endDate, purpose } = req.body;
    if (!assetId || !startDate || !endDate) {
      return res.status(400).json({ message: "Asset, start date, and end date are required." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ message: "Start date must be before end date." });
    }

    // Check if the asset exists and is bookable
    const asset = await Asset.findOne({ _id: assetId, organization: req.user.organization });
    if (!asset) return res.status(404).json({ message: "Asset not found." });
    if (!asset.sharedBookable) {
      return res.status(400).json({ message: "This asset is not marked as a shared bookable resource." });
    }

    // Overlap validation logic
    const overlapping = await Booking.findOne({
      asset: assetId,
      organization: req.user.organization,
      status: { $in: ["Upcoming", "Ongoing"] },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } }, // overlap check
      ],
    });

    if (overlapping) {
      return res.status(409).json({
        message: "This resource is already booked during the requested time slot.",
        overlappingBooking: {
          startDate: overlapping.startDate,
          endDate: overlapping.endDate,
        },
      });
    }

    const booking = await Booking.create({
      asset: assetId,
      user: req.user.id,
      organization: req.user.organization,
      startDate: start,
      endDate: end,
      purpose,
      status: "Upcoming",
    });

    res.status(201).json({ success: true, booking });
  })
);

// PUT cancel booking
router.put(
  "/:id/cancel",
  authenticate,
  wrapAsync(async (req, res) => {
    const booking = await Booking.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });

    if (!booking) return res.status(404).json({ message: "Booking not found." });

    // Only user who booked it or an Admin/AssetManager can cancel it
    if (booking.user.toString() !== req.user.id && !["Admin", "AssetManager"].includes(req.user.role)) {
      return res.status(403).json({ message: "You are not authorized to cancel this booking." });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({ success: true, booking });
  })
);

module.exports = router;
