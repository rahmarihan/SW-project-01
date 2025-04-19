const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const protect  =  require('../middleware/Authentication');
const roleCheck = require('../middleware/Authorization');
// @desc    Register a new user
// @route   POST /api/v1/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    console.log('Register Request Body:', req.body);


    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });
        
        // Generate token
        const token = generateToken(user._id);
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        console.error('Register Error:', error.message); // Log the error message
        console.error('Stack Trace:', error.stack);      // Log the stack trace for more context
        res.status(500).json({ message: 'Server error' });
    }
    
};

// @desc    Authenticate user
// @route   POST /api/v1/login
// @access  Public
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate a JWT token with the role included
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // Set the token as a cookie
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600000,
        })
        .status(200)
        .json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
    } catch (error) {
      console.error("Error in login:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  


// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        console.log('User from middleware:', req.user); // Debugging log
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getUserProfile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.profilePicture = req.body.profilePicture || user.profilePicture;
            
            if (req.body.password) {
                user.password = req.body.password;
            }
            
            const updatedUser = await user.save();
            
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePicture: updatedUser.profilePicture,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Generate JWT
const generateToken = (id) => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);  // Add this to debug
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};


// @desc    Send password reset token
// @route   PUT /api/v1/forgetPassword
// @access  Public
const forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.resetToken = crypto.randomBytes(20).toString('hex');
        user.resetTokenExpiry = Date.now() + 600000; // 10 mins
        await user.save();

        res.json({
            message: 'Reset token generated (simulated email)',
            token: user.resetToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reset password using token
// @route   PUT /api/v1/resetPassword
// @access  Public
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin-specific handlers
const getAllUsers = async (req, res) => {
    console.log('Inside getAllUsers controller'); // Log to confirm execution
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUsers:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -resetToken -__v');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role || !['user', 'organizer', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Allowed: user, organizer, admin' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password -resetToken -__v');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            message: 'User deleted successfully',
            deletedUser: {
                _id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
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
};