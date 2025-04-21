const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const protect  =  require('../middleware/Authentication');
const roleCheck = require('../middleware/Authorization');
const nodemailer = require('nodemailer');
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

        // Send the response only once
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token, // Include the token here if needed
        });

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



// @desc    Send password reset token with MFA (OTP)
// @route   PUT /api/v1/forgetPassword
// @access  Public
const forgetPassword = async (req, res) => {
    console.log("forgetPassword function triggered");
    const { email, newPassword, otp } = req.body;

    try {
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Step 1: If OTP is not sent yet, generate and "send" it (mocking email sending)
        if (!user.otpSent || Date.now() > user.otpExpiresAt) {
            const generatedOtp = "123abc"; // Mock OTP generation
            user.otp = generatedOtp; // Store OTP
            user.otpSent = true; // Mark OTP as sent
            user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // Expiration time: 10 minutes from now
            await user.save();

            console.log(`Mock OTP sent to ${email}: ${generatedOtp}`);

            return res.status(200).json({ message: "OTP sent to email (mocked)", otp: generatedOtp });
        }

        console.log(`OTP from request: ${otp}`);
        console.log(`OTP in DB: ${user.otp}`);
        console.log(`OTP expiry: ${user.otpExpiresAt}`);

        // Step 2: If OTP is provided, verify it
        if (otp !== user.otp) {
            console.log("OTP verification failed.");
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Optional: Check if OTP has expired
        if (Date.now() > user.otpExpiresAt) {
            console.log("OTP has expired.");
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Step 3: If OTP is valid, update the password
        user.password = newPassword;
        await user.save(); // Password will be hashed by pre-save hook

        // Clear OTP fields after successful password reset
        user.otp = null;
        user.otpSent = false;
        user.otpExpiresAt = null;
        await user.save();

        console.log("Password updated successfully");
        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error in forgetPassword:", error.message);
        res.status(500).json({ message: "Server error, please try again later" });
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
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
};


// Function to generate a random OTP
const generateOTP = () => {
    return crypto.randomBytes(3).toString('hex'); // 6-character OTP
};


// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your preferred email service
        auth: {
            user: 'your-email@example.com', // Your email
            pass: 'your-email-password', // Your email password or app password
        },
    });

    const mailOptions = {
        from: 'your-email@example.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent to email');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Error sending OTP email');
    }
};
