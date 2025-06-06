const Event = require('../models/Event'); // Assuming you have the Event model
const ErrorResponse = require('../utils/errorResponse'); // Assuming you have custom error handling
const _ = require('lodash');
const mongoose = require('mongoose');

// 12 API 1: GET /api/v1/users/events/analytics (Organizer)
exports.getOrganizerEventAnalytics = async (req, res, next) => {
  try {
    // Fetch all events for the current organizer
    const events = await Event.find({ organizer: req.user.id });

    // Initialize groups
    const grouped = {
      approved: [],
      pending: [],
      declined: []
    };

    // Group events by status and compute analytics
    events.forEach(event => {
      const sold = event.totalTickets - event.remainingTickets;
      const percentage = ((sold / event.totalTickets) * 100).toFixed(2);
      const revenue = (sold * event.ticketPrice).toFixed(2);

      const eventData = {
        eventId: event._id,
        title: event.title,
        tickets: {
          total: event.totalTickets,
          sold,
          remaining: event.remainingTickets,
          percentage: parseFloat(percentage)
        },
        revenue: parseFloat(revenue)
      };

      if (grouped[event.status]) {
        grouped[event.status].push(eventData);
      }
    });

    // Prepare response
    const graphData = {};
    Object.keys(grouped).forEach(status => {
      graphData[status] = {
        labels: grouped[status].map(e => e.title),
        values: grouped[status].map(e => e.tickets.percentage)
      };
    });

    res.status(200).json({
      success: true,
      groupedAnalytics: grouped,
      graphData
    });
  } catch (err) {
    next(err);
  }
};


// 11 Get all events created by the current organizer (get current user's events)
exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ 
      organizer: req.user.id
    }).sort({ createdAt: -1 });

    // Map events to include all public fields, including image
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
      category: event.category,
      status: event.status
    }));

    res.status(200).json({
      success: true,
      count: response.length,
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching organizer events',
      error: error.message
    });
  }
};


// task c.4 Change Event Status (Admin only)
exports.changeEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;  // The new status to set

    // Validate status (You can add more status checks if needed)
    const validStatuses = ['approved', 'pending', 'declined'];
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
    // Only use image from req.body (URL), not file upload
    const { title, date, location, ticketPrice, totalTickets, image } = req.body;

    if (!title || !date || !location || !ticketPrice || !totalTickets) {
      return next(new ErrorResponse('Missing required fields', 400));
    }

    const event = await Event.create({
      ...req.body,
      image: image, // Only from body
      organizer: req.user.id,  // From JWT
      status: 'pending',       // Default status
      remainingTickets: totalTickets // Initialize availability
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully (pending admin approval)',
      data: {
        id: event.id,
        title: event.title,
        date: event.date,
        status: event.status,
        image: event.image
      }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorResponse(Object.values(err.errors).map(e => e.message).join(', '), 400));
    }
    next(err);
  }
};

//API 17: get list of all approved events (GET) /api/v1/events (public endpoint)
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

//API 18:  Get list of all events (approved,pending,declined)
exports.getAllEventsForAdmin = async (req, res, next) => {
  try {
    // 1. Get ALL events (including pending/declined)
    const events = await Event.find()
      .select('-__v') // Exclude version key
      .populate('organizer', 'name email') // Include organizer info
      .sort({ createdAt: -1 }); // Newest first

    // 2. Format response
    res.status(200).json({
      success: true,
      count: events.length,
      data: events.map(event => ({
        id: event._id,
        title: event.title,
        status: event.status,
        date: event.date,
        organizer: event.organizer,
        tickets: {
          total: event.totalTickets,
          available: event.remainingTickets
        },
        createdAt: event.createdAt
      }))
    });

  } catch (err) {
    next(err);
  }
};

//API 19: get details of a single event (GET) /api/v1/events/:id 
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

// API 20: update an event (PUT) /api/v1/events/:id (Organizer/Admin)
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

//API 21: delete an event (DELETE) /api/v1/events/:id (Organizer/Admin)
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

