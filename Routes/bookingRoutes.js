const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const  authenticate = require('middleware\Authentication.js');
const  authorize = require('middleware\Authorization.js');

// Book tickets (Authenticated users only)
router.post(
  '/',
  authenticate,
  authorize('user'),
  bookingController.createBooking
);

// Get user bookings (Authenticated users only)
router.get(
  '/',
  authenticate,
  authorize('user'),
  bookingController.getUserBookings
);

// Cancel booking (Authenticated users only)
router.delete(
  '/:id',
  authenticate,
  authorize('user'),
  bookingController.cancelBooking
);

router.get(
  '/api/v1/bookings/:id',
  authenticate,
  authorize('user'), // Only standard users can access
  bookingController.getBookingDetails
);

module.exports = router;