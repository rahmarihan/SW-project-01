const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} = require('c:/Users/My Lab/Desktop/SW3/Controllers/userController');
const { protect } = require('C:\Users\My Lab\Desktop\SW3\Middleware\Authentication.js');

// Public routes
router.post('/api/v1/register ', registerUser);
router.post('/api/v1/login', loginUser);

// Protected routes
router.route('/api/v1/users/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;