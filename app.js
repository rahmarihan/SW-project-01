const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const cors = require("cors")
const connectDB = require('./config/db');

const app = express()

connectDB()

app.use(express.json())

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

