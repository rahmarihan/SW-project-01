const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../models/User'); // Your User model
const crypto = require('crypto'); // For generating random tokens
const authenticate =  require('../middleware/Authentication'); // Authentication middleware
const authorize = require('../middleware/Authorization');
const bookingController = require('../controllers/bookingController');

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
const { getUserBookings } = require('../controllers/bookingController');


// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/forgetPassword', forgetPassword);

router.get('/users/bookings', authenticate, authorize(['user']), getUserBookings);


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
