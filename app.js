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