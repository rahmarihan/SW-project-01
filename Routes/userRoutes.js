const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../models/User'); // Your User model
const authenticate = require('middleware\Authentication.js'); // Authentication middleware
const authorize = require('middleware\Authorization.js');
const crypto = require('crypto'); // For generating random tokens
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} = require('../Controllers/userController');
const { protect } = require('middleware\Authentication.js');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser)

// Protected routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// PUT /api/v1/forgetPassword
router.put('/forgetPassword', async (req, res) => {
    const { email } = req.body;

    try{
      //find user 
      const user = await User.findOne({email});
      if(!user) return res.status(404).json({ message: "User not found"});

      //Generate token (expires in 10 mins)
      user.resetToken = crypto.randomBytes(20).toString('hex');
      user.resetTokenExpiry = Date.now() + 600000; // 10 minutes
      await user.save();

      res.json({
        message: "Reset token generated (simulated email)",
        token: user.resetToken
      });
    } catch (error) {
      res.status(500).json({ message: "Server error"});
    
    }
    });

    // reset password with token 
  router.put('/resetPassword', async (req, res)=>{
    const { token, newPassword } = req.body;

    try {
        // Find user by reset token and check if it's expired
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Check if token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password and save it
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetToken = undefined; // Clear the reset token
        user.resetTokenExpiry = undefined; // Clear the expiry date
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
  }
  )


// GET /api/v1/users (Admin-only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
    try {
      // Fetch all users, excluding sensitive fields (password, resetToken)
      const users = await User.find({})
        .select('-password -resetToken -__v')
        .lean();
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });


// GET /api/v1/users/:id (Admin-only)
router.get('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
      // 1. Find user by ID and exclude sensitive fields
      const user = await User.findById(req.params.id)
        .select('-password -resetToken -__v');
  
      // 2. Handle user not found
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // 3. Return safe user data
      res.json(user);
    } catch (error) {
        // 4. Handle specific errors
        if (error.name === 'CastError') {
          return res.status(400).json({ message: 'Invalid user ID format' });
        }
        // 5. Catch-all for server errors
        res.status(500).json({ message: 'Server error' });
      }
    });


// PUT /api/v1/users/:id (Admin-only role update)
router.put('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
      // 1. Validate request body
      const { role } = req.body;
      if (!role || !['user', 'organizer', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Allowed: user, organizer, admin' });
      }
      // 2. Find user and update role
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
      ).select('-password -resetToken -__v');
  
      // 3. Handle user not found
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // 4. Return updated user (without sensitive fields)
    res.json(user);
} catch (error) {
  // 5. Handle errors
  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }
  res.status(500).json({ message: 'Server error' });
}
});
  

// DELETE /api/v1/users/:id (Admin-only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
      // 1. Find and delete user
      const user = await User.findByIdAndDelete(req.params.id);
  
      // 2. Handle user not found
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // 3. Return success (no sensitive data)
      res.json({ 
        message: 'User deleted successfully',
        deletedUser: {
          _id: user._id,
          email: user.email,
          role: user.role
        }
    });
} catch (error) {
  // 4. Handle errors
  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }
  res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;