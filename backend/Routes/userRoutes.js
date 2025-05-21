const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const crypto = require('crypto'); // For generating random tokens
const User = require('../models/User.js');
const authenticate = require('../middleware/Authentication.js');
const authorize = require('../middleware/Authorization.js');
const bookingController = require('../Controllers/bookingController.js');
const { getOrganizerEvents } = require('../Controllers/eventController.js');
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    forgetPassword,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
} = require('../Controllers/userController.js');

const { getUserBookings } = require('../Controllers/bookingController.js');
const { getOrganizerEventAnalytics } = require('../Controllers/eventController.js');
const { createBooking } = require('../Controllers/bookingController.js');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/forgetPassword', forgetPassword);

router.get('/users/bookings', authenticate, authorize(['user']), getUserBookings);
router.get(
    '/users/events',
    authenticate,
    authorize(['organizer']),
    getOrganizerEvents
  );

  router.get(
    '/users/events/analytics',
    authenticate,
    authorize(['organizer']),
    getOrganizerEventAnalytics
  );


  router.post('/bookings', authenticate, authorize(['user']), createBooking);


// Protected user profile
router.route('/users/profile')
    .get(authenticate, authorize(['user', 'admin']), getUserProfile)  // Only authenticated users or admins can get profile
    .put(authenticate, authorize(['user', 'admin']), updateUserProfile);  // Only authenticated users or admins can update profile


    
// Admin-only routes
router.get('/users', authenticate, authorize(['admin']), getAllUsers);
router.get('/users/:id', authenticate, authorize(['admin']), getUserById);
router.put('/users/:id', authenticate, authorize(['admin']), updateUserRole);
router.delete('/users/:id', authenticate, authorize(['admin']), deleteUser);



module.exports = router;
