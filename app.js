const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const cors = require("cors")
const connectDB = require('./config/db');

const app = express()

connectDB()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is running');
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);



});

// Add this with your other route imports
const bookingRoutes = require('C:\Users\Lenovo\OneDrive\Desktop\Software\SOFTWAREPROJECT1\SW-project-01\Routes\bookingRoutes.js');

// Add this with your other route middleware
app.use('/api/v1/bookings', bookingRoutes);