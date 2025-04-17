const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');

// Part C.1 - Organizer gets their own events
exports.getOrganizerEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ 
      organizer: req.user.id, 
      status: { $ne: 'declined' } // Hide declined events
    });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
};

// Part C.2 - Organizer edits event (only tickets/date/location)
exports.updateEvent = async (req, res, next) => {
  const allowedUpdates = ['date', 'location', 'totalTickets'];
  const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));
  
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user.id }, // Ensure ownership
      updates.reduce((obj, key) => ({ ...obj, [key]: req.body[key] }), {}),
      { new: true, runValidators: true }
    );
    if (!event) throw new ErrorResponse('Event not found or unauthorized', 404);
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// Part C.3 - Admin approves/rejects events
exports.changeEventStatus = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!event) throw new ErrorResponse('Event not found', 404);
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// Part C.4 - Organizer analytics (ticket booking %)
exports.getEventAnalytics = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    const analytics = events.map(event => ({
      eventId: event._id,
      title: event.title,
      bookedPercent: ((event.totalTickets - event.remainingTickets) / event.totalTickets * 100).toFixed(2),
      status: event.status
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