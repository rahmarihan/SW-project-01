const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Task: Authenticated standard users can book tickets of an event
exports.createBooking = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;
    const userId = req.user._id;

    // Validation
    if (!eventId || !numberOfTickets || numberOfTickets < 1) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Find event and check availability
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check ticket availability
    if (event.ticketsAvailable < numberOfTickets) {
      return res.status(400).json({ 
        error: 'Not enough tickets available',
        ticketsAvailable: event.ticketsAvailable
      });
    }

    // Calculate total price
    const totalPrice = event.price * numberOfTickets;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      event: eventId,
      numberOfTickets,
      totalPrice
    });

    // Update available tickets
    event.ticketsAvailable -= numberOfTickets;
    await event.save();

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Task: Authenticated standard users can view their bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date location price')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Task: Authenticated standard users can cancel their tickets
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized action' });
    }

    // Check if already canceled
    if (booking.status === 'canceled') {
      return res.status(400).json({ error: 'Booking already canceled' });
    }

    // Find event and restore tickets
    const event = await Event.findById(booking.event);
    if (event) {
      event.ticketsAvailable += booking.numberOfTickets;
      await event.save();
    }

    // Update booking status
    booking.status = 'canceled';
    await booking.save();

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};