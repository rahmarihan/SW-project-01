const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017';
    const dbName = process.env.DB_NAME || 'event_ticketing';
    await mongoose.connect(`${dbUrl}/${dbName}`);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
};

module.exports = connectDB;