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
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())


app.use(
    cors({
      origin: process.env.ORIGIN,
      methods: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,
    })
  );


// Routes
app.use('/api/v1', userRoutes);

app.use(authenticationMiddleware);


const db_name = process.env.DB_NAME;

const db_url = `${process.env.db_URL}/${db_name}`;

// ! Mongoose Driver Connection



mongoose
  .connect(db_url)
  .then(() => console.log("mongoDB connected"))
  .catch((e) => {
    console.log(e);
  });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});
app.listen(process.env.PORT, () => console.log("server started"));

