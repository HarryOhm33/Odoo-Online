const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const {
  getBookings,
  createBooking,
  cancelBooking,
} = require("../controllers/booking");

router.get("/", authenticate, wrapAsync(getBookings));
router.post("/", authenticate, wrapAsync(createBooking));
router.put("/:id/cancel", authenticate, wrapAsync(cancelBooking));

module.exports = router;
