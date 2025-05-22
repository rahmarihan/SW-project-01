require('dotenv').config(); // Ensure this is at the top of your app.js or index.js
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const cors = require("cors")
const connectDB = require('./config/db');

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log("NODE_ENV:", process.env.NODE_ENV);

const app = express()

connectDB()

// ✅ CORS middleware should come before your routes
app.use(cors({
  origin: 'http://localhost:5173', // your frontend
  credentials: true                // allow cookies/auth headers if used
}));

app.use(cookieParser());
app.use(express.json())

const userRoutes = require('./Routes/userRoutes')
const eventRoutes = require('./Routes/eventRoutes')
const bookingRoutes = require('./Routes/bookingRoutes')

// Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'active',
    message: 'Event Ticketing System API' 
  });
});

// Error Handling Middleware (Must be last!)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT} | http://localhost:${PORT}`)
);
