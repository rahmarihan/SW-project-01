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

app.use(cookieParser());
app.use(express.json())



const userRoutes = require('./Routes/userRoutes')
const eventRoutes = require('./Routes/eventRoutes')
const bookingRoutes = require('./Routes/bookingRoutes')


// Don't apply authentication globally to all routes if not needed
app.use('/api/v1', userRoutes); // User routes may need authentication
app.use('/api/v1/events', eventRoutes); // Event routes - add authentication where needed
app.use('/api/v1/bookings', bookingRoutes); // Same for bookings, only protect when needed



app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'active',
    message: 'Event Ticketing System API' 
  });
});

// Error Handling Middleware (Must be last!)
app.use((err, req, res, next) => {
  console.error(' Error:', err.stack);
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

