// API 1: GET /api/v1/users/events/analytics (Organizer)
exports.getOrganizerEventAnalytics = async (req, res, next) => {
  try {
    const events = await Event.find({ 
      organizer: req.user.id,
      status: 'approved' // Only show approved events
    });

    const analytics = events.map(event => ({
      eventId: event._id,
      title: event.title,
      tickets: {
        total: event.totalTickets,
        sold: event.totalTickets - event.remainingTickets,
        percentage: ((event.totalTickets - event.remainingTickets) / event.totalTickets * 100).toFixed(2)
      },
      revenue: (event.ticketPrice * (event.totalTickets - event.remainingTickets)).toFixed(2)
    }));

    res.status(200).json({ success: true, data: analytics });
  } catch (err) {
    next(err);
  }





  const createEvent = async (req, res) => {
    const { name, description, date, location } = req.body;

    try {
        const event = await Event.create({
            name,
            description,
            date,
            location,
            organizer: req.user._id // Save the organizer's ID
        });

        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



const getAllEvents = async (req, res) => {
  try {
      const events = await Event.find().populate('organizer', 'name email');
      res.status(200).json(events);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};



};

// API 2: GET /api/v1/events/:id (Public)
exports.getSingleEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id,
      status: 'approved' // Only accessible if approved
    }).populate('organizer', 'name email');

    if (!event) {
      return next(new ErrorResponse('Event not found or not approved', 404));
    }

    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// API 3: PUT /api/v1/events/:id (Organizer/Admin)
exports.updateEventDetails = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    
    // Authorization check
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this event', 403));
    }

    // Organizers can only update specific fields
    if (req.user.role === 'organizer') {
      const { date, location, totalTickets } = req.body;
      event = await Event.findByIdAndUpdate(req.params.id, 
        { date, location, totalTickets },
        { new: true, runValidators: true }
      );
    } else {
      // Admins can update any field
      event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// API 4: DELETE /api/v1/events/:id (Organizer/Admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return next(new ErrorResponse('Event not found', 404));
    }

    // Authorization check
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this event', 403));
    }

    await event.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }


};
// Get all events created by the current organizer
exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ 
      organizer: req.user._id  // Filter by logged-in organizer
    }).sort({ createdAt: -1 });  // Newest first

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching organizer events',
      error: error.message
    });
  }

};