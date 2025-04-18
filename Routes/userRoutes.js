const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../models/User'); // Your User model
const crypto = require('crypto'); // For generating random tokens
const authenticate =  require('../middleware/Authentication'); // Authentication middleware
const authorize = require('../middleware/Authorization');

const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    forgetPassword,
    resetPassword,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
} = require('../Controllers/userController');



// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/forgetPassword', forgetPassword);
router.put('/resetPassword', resetPassword);

// Protected user profile
router.route('/profile')
    .get(authenticate, getUserProfile)
    .put(authenticate, updateUserProfile);

// Admin-only routes
router.get('/', authenticate, authorize(['admin']), getAllUsers);
router.get('/:id', authenticate, authorize(['admin']), getUserById);
router.put('/:id', authenticate, authorize(['admin']), updateUserRole);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);

module.exports = router;
