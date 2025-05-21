// controllers/bookingController.js

const Booking = require('../models/Booking');
const Event = require('../models/Event');
const mongoose = require('mongoose');


// ✅ Create Booking
const createBooking = async (req, res) => {
  try {
    console.log("🔐 User from token:", req.user);

    const userId = req.user.id;  // Corrected to `req.user.id` if you're using JWT payload
    const { eventId, numOfTickets } = req.body;

    // 1. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ message: 'Booking is only allowed for approved events' });
    }

    // 2. Check available tickets
    if (event.remainingTickets < numOfTickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // 3. Calculate total price
    const totalPrice = numOfTickets * event.ticketPrice;

    // 4. Update ticket count atomically
    await Event.findByIdAndUpdate(eventId, {
      $inc: { remainingTickets: -numOfTickets }
    });

    // 5. Create and save the booking
    const newBooking = new Booking({
      user: userId,  // Pass the correct user ID here
      event: eventId,
      numberOfTickets: numOfTickets,
      totalPrice,
      status: 'confirmed'  // Corrected to 'pending' or 'confirmed' as per your schema
    });

    await newBooking.save();

    // 6. Send response
    return res.status(201).json({
      message: 'Booking successful',
      booking: newBooking
    });

  } catch (error) {
    console.error("🚨 Booking Error:", error);
    return res.status(500).json({ message: 'Server Error while booking', error: error.message });
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
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow if the booking belongs to the logged-in user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to view this booking' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    // Step 1: Find and update the booking (mark as canceled)
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'canceled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Step 2: Find the associated event
    const eventId = booking.event?._id || booking.event; // handle both populated or ObjectId
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Associated event not found' });
    }

    // Step 3: Update event ticket counts
    const ticketsToReturn = booking.numberOfTickets || 1; // default to 1 if not defined

    event.remainingTickets += ticketsToReturn;
    event.soldTickets -= ticketsToReturn;

    // Prevent negative values
    if (event.soldTickets < 0) event.soldTickets = 0;
    await event.save();

    // Step 4: Respond
    res.status(200).json({
      success: true,
      message: 'Booking canceled and event ticket counts updated',
      data: booking
    });
  } catch (error) {
    console.error("❌ Error canceling booking:", error.message, error.stack);
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
