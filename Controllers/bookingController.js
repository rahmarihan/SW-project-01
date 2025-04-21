const createBooking = async (req, res) => {
  try {
    console.log('Incoming body:', req.body);
    const { event, numberOfTickets } = req.body;

    // Ensure the number of tickets is valid
    const tickets = parseInt(numberOfTickets);
    if (isNaN(tickets) || tickets <= 0) {
      return res.status(400).json({ message: 'Invalid number of tickets' });
    }

    // Find the event by ID
    const selectedEvent = await Event.findById(event);
    console.log('Selected Event:', selectedEvent);

    if (!selectedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check that the event has a valid price
    if (typeof selectedEvent.price !== 'number') {
      return res.status(500).json({ message: 'Invalid event price' });
    }

    // Ensure enough tickets are available for the booking
    if (selectedEvent.availableTickets < tickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Calculate the total price for the booking
    const totalPrice = selectedEvent.price * tickets;
    console.log('Total Price:', totalPrice);

    // Create the new booking document
    const booking = new Booking({
      user: req.user.id,
      event,
      numberOfTickets: tickets,
      totalPrice,
    });

    // Save the booking to the database
    const savedBooking = await booking.save();
    console.log('Saved Booking:', savedBooking);

    // Reduce the number of available tickets for the event
    selectedEvent.availableTickets -= tickets;
    await selectedEvent.save();

    // Send a success response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking,
    });
  } catch (error) {
    // Catch any errors and send a server error response
    console.error("🔥 Caught error in createBooking:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
