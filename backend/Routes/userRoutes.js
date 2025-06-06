const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../models/User'); // Your User model
const crypto = require('crypto'); // For generating random tokens
const authenticate =  require('../middleware/Authentication'); // Authentication middleware
const authorize = require('../middleware/Authorization');
const bookingController = require('../Controllers/bookingController');
const { getOrganizerEvents } = require('../Controllers/eventController');


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
} = require('../Controllers/userController');
const { getUserBookings } = require('../Controllers/bookingController');
const { getOrganizerEventAnalytics } = require('../Controllers/eventController');
const { createBooking } = require('../Controllers/bookingController');


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
    .get(authenticate, authorize(['user', 'admin', 'organizer']), getUserProfile)
    .put(authenticate, authorize(['user', 'admin', 'organizer']), updateUserProfile);


    
// Admin-only routes
router.get('/users', authenticate, authorize(['admin']), getAllUsers);
router.get('/users/:id', authenticate, authorize(['admin']), getUserById);
router.put('/users/:id', authenticate, authorize(['admin']), updateUserRole);
router.delete('/users/:id', authenticate, authorize(['admin']), deleteUser);



module.exports = router;
