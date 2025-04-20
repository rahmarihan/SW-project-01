const Event = require('../models/Event'); // Assuming you have the Event model
const ErrorResponse = require('../utils/errorResponse'); // Assuming you have custom error handling
const _ = require('lodash');


// 12 API 1: GET /api/v1/users/events/analytics (Organizer)
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
};

/* 18 API 2: GET /api/v1/events/:id (Public)
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
*/

/* 19 API 3: PUT /api/v1/events/:id (Organizer/Admin)
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
*/

// 11 Get all events created by the current organizer (get current user's events)
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

/*16 API for creating an event
exports.createEvent = async (req, res) => {
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
}; */

/* 17 Get all events (for public view)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
*/

// task c.4 Change Event Status (Admin only)
exports.changeEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;  // The new status to set

    // Validate status (You can add more status checks if needed)
    const validStatuses = ['approved', 'pending', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find the event by ID
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Authorization check: Only admin can change the status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to change event status' });
    }

    // Update the event status
    event.status = status;

    // Save the updated event
    event = await event.save();

    res.status(200).json({
      success: true,
      message: 'Event status updated successfully',
      data: event
    });
  } catch (err) {
    next(err);
  }
};


//elena´s latest apis
//API 16: create a new event (POST) /api/v1/events (Organizer)
exports.createEvent = async (req, res, next) => {
  try {

    console.log('Request body:', req.body);

      const { title, date, location, ticketPrice, totalTickets } = req.body;

      if (!title || !date || !location || !ticketPrice || !totalTickets) {
          return next(new ErrorResponse('Missing required fields', 400));
      }

      const event = await Event.create({
          ...req.body,
          organizer: req.user.id,  // From JWT
          status: 'pending',       // Default status
          remainingTickets: totalTickets // Initialize availability
      });

      res.status(201).json({
          success: true,
          message: 'Event created successfully (pending admin approval)',
          data: {
              id: event._id,
              title: event.title,
              date: event.date,
              status: event.status
          }
      });

  } catch (err) {
      if (err.name === 'ValidationError') {
          return next(new ErrorResponse(Object.values(err.errors).map(e => e.message).join(', '), 400));
      }
      next(err);
  }
};

//API 17: get list of all events (GET) /api/v1/events (public endpoint)
exports.getAllPublicEvents = async (req, res, next) => {
  try {
    // 1. Get only APPROVED events with ticket availability
    const events = await Event.find({ 
      status: 'approved',
      remainingTickets: { $gt: 0 } // Only events with available tickets
    })
    .select('-__v -createdAt -updatedAt') // Exclude internal fields
    .populate('organizer', 'name email') // Include organizer details
    .sort({ date: 1 }); // Sort by date (ascending)

    // 2. Format public-friendly response
    const response = events.map(event => ({
      id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      ticketPrice: event.ticketPrice,
      availableTickets: event.remainingTickets,
      organizer: event.organizer,
      image: event.image,
      category: event.category
    }));

    res.status(200).json({
      success: true,
      count: response.length,
      data: response
    });

  } catch (err) {
    next(err);
  }
};

//API 18: get details of a single event (GET) /api/v1/events/:id 
exports.getEventDetails = async (req, res, next) => {
  try {
    // 1. Find only APPROVED events
    const event = await Event.findOne({
      _id: req.params.id,
      status: 'approved'
    }).populate('organizer', 'name email'); // Show basic organizer info

    // 2. Handle missing/not-approved events
    if (!event) {
      return next(new ErrorResponse('Event not found or not approved', 404));
    }

    // 3. Return public-friendly response
    res.status(200).json({
      success: true,
      data: {
        id: event._id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        ticketPrice: event.ticketPrice,
        availableTickets: event.remainingTickets,
        organizer: event.organizer,
        image: event.image
      }
    });

  } catch (err) {
    next(err);
  }
};

// API 19: update an event (PUT) /api/v1/events/:id (Organizer/Admin)
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    // 1. Check if event exists
    if (!event) {
      return next(new ErrorResponse('Event not found', 404));
    }

    // 2. Authorization - Organizer (owner) OR Admin
    const isOwner = event.organizer.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return next(new ErrorResponse('Not authorized. Must be event owner or admin', 403));
    }

    // 3. Define updatable fields based on role
    const updatableFields = isAdmin 
      ? req.body // Admins can update all fields
      : _.pick(req.body, ['date', 'location', 'totalTickets']); // Organizers limited

    // 4. Update and validate
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updatableFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedEvent
    });

  } catch (err) {
    next(err);
  }
};

//API 20: delete an event (DELETE) /api/v1/events/:id (Organizer/Admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    // 1. Check if event exists
    if (!event) {
      return next(new ErrorResponse('Event not found', 404));
    }

    // 2. Authorization - Organizer (owner) OR Admin
    const isOwner = event.organizer.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return next(new ErrorResponse('Not authorized. Must be event owner or admin', 403));
    }

    // 3. Delete
    await event.deleteOne();
    
    res.status(200).json({ 
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (err) {
    next(err);
  }
};

