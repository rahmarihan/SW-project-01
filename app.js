require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/eventRoutes');
const ErrorResponse = require('./utils/errorResponse'); // Ensure this path is correct

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Database Connection (MongoDB)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-ticketing', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/v1/events', eventRoutes); // Part C Event Management Routes

// Health Check Endpoint
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
const PORT = process.env.PORT || 5000c;
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT} | http://localhost:${PORT}`)
);

