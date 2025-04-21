createBooking: async (req, res) => {
  try {
    console.log("🔐 User from token:", req.user);

    const userId = req.user.userId;
    const { eventId, numOfTickets } = req.body;

    // 1. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
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
      user: userId,
      event: eventId,
      numberOfTickets: numOfTickets,
      totalPrice,
      status: 'Confirmed'
    });

    await newBooking.save();

    // 6. Send response
    return res.status(201).json({
      message: 'Booking successful',
      booking: newBooking
    });

  } catch (error) {
    console.error("🚨 Booking Error:", error);
    return res.status(500).json({ message: 'Server Error while booking' });
  }
}