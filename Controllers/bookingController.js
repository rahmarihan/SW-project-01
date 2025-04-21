// controllers/bookingController.js

const Booking = require('../models/Booking');
const Event = require('../models/Event');

// ✅ Create Booking
const createBooking = async (req, res) => {
  try {
    const { event, numberOfTickets } = req.body;

    const selectedEvent = await Event.findById(event);
    if (!selectedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const totalPrice = selectedEvent.price * numberOfTickets;

    const booking = new Booking({
      user: req.user.id,
      event,
      numberOfTickets,
      totalPrice,
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get Bookings of Current User
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Booking by ID
const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id }).populate('event');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'canceled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking canceled successfully',
      data: booking
    });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Export them all
module.exports = {
  createBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking
};
