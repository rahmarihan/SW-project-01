const express = require('express');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/eventRoutes');
const ErrorResponse = require('./utils/errorResponse');

const app = express();

// Middleware
app.use(express.json());

// Database connection (MongoDB)
mongoose.connect('mongodb://localhost:27017/event-ticketing', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Part C: Event Management Routes
app.use('/api/v1/events', eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));