const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const cors = require("cors")
const connectDB = require('./config/db');
const dotenv = require('dotenv');


const userRoutes = require('./routes/userRoutes');
const authenticationMiddleware=require('C:\Users\My Lab\Desktop\SW3\Middleware\Authentication.js')


const app = express()

app.use(express.json())

app.use(cookieParser());
app.use(cors());

// Example: Add your routes or middleware here
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Server is running');
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});