const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');
const  authenticate = require('../middleware/Authentication');
const  authorize = require('../middleware/Authorization');

const {
  createBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking
} = require('../Controllers/bookingController');


// Book tickets (Authenticated users only)
// router.post(
//   '/',
//   authenticate,
//   authorize(['user']),
//   bookingController.createBooking
// );

// In bookingRoutes.js, instead of GET '/' use something specific:
router.get(
  '/user-bookings',
  authenticate,
  authorize(['user']),
  bookingController.getUserBookings
);

// Cancel booking (Authenticated users only)
router.delete(
  '/:id',
  authenticate,
  authorize(['user']),
  bookingController.cancelBooking
);

router.get(
  '/:id',
  authenticate,
  authorize(['user']), // Only standard users can access
  bookingController.getBookingDetails
);

module.exports = router;