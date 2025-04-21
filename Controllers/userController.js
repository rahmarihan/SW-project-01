const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const protect  =  require('../middleware/Authentication');
const roleCheck = require('../middleware/Authorization');
const secretKey = process.env.JWT_SECRET;

// @desc    Register a new user
// @route   POST /api/v1/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    console.log("Registration Request Body:", req.body);

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
            password,  // Store the hashed password
            role: role || 'user',
        });

        // Generate a JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            //token
        });
        res.status(201).json({ message: "User registered", user });

    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({
            message: "Server error",
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};



// @desc    Authenticate user
// @route   POST /api/v1/login
// @access  Public
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🧪 Step 1: Log the incoming request body
        console.log("Login Request Body:", req.body);

        // Find the user by email
        const user = await User.findOne({ email });
        console.log('User from database:', user);

        if (!user) {
            console.log("User not found with email:", email);
            return res.status(404).json({ message: "User not found" });
        }

        // 🧪 Step 2: Compare the provided password with the hashed password in the database
        console.log("Entered password:", password);
        console.log("Stored password hash:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match status:", isMatch);

        if (!isMatch) {
            console.log("Invalid credentials");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 🧪 Step 3: Log the JWT secret and user information before generating token
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.log("Generating token for user:", user);

        // Generate a JWT token with the user's ID, email, and role
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set the token as a cookie and send response
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // Token expiry (1 hour)
        })
        .status(200)
        .json({
            token,  // Send token in the response body
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
// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // ✅ Just assign the plain password – let pre-save hook hash it
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });

    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ message: "Server error" });
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
    console.log("forgetPassword function triggered");
    const { email, newPassword } = req.body;

    try {
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Do NOT hash it here
        user.password = newPassword;

        console.log("Password before save:", user.password);
        await user.save(); // pre-save hook will hash it
        console.log("Password after save (should be hashed):", user.password);

        console.log("Password updated successfully");
        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error in forgetPassword:", error.message);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};

// @desc    Reset password using token
// @route   PUT /api/v1/resetPassword
// @access  Public
// const resetPassword = async (req, res) => {
//     const { email, newPassword, token } = req.body;
  
//     try {
//       const user = await User.findOne({ email });
  
//       if (
//         !user ||
//         user.resetToken !== token ||
//         user.resetTokenExpiry < Date.now()
//       ) {
//         return res.status(400).json({ message: 'Invalid or expired token' });
//       }
  
//       // Update password
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(newPassword, salt);
  
//       // Clear reset token and expiry
//       user.resetToken = undefined;
//       user.resetTokenExpiry = undefined;
  
//       await user.save();
  
//       res.json({ message: 'Password successfully reset' });
  
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };

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
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
};