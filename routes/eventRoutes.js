const express = require('express');
const router = express.Router();

const {
  getOrganizerEventAnalytics,
  getOrganizerEvents,
  changeEventStatus,
  createEvent,
  getAllPublicEvents,
  getAllEventsForAdmin,
  getEventDetails,
  updateEvent,
  deleteEvent,
  getEventAnalyticsById,  // Make sure this is implemented in your controller
} = require('../Controllers/eventController');

// Import your authentication and authorization middleware
const protect = require('../middleware/Authentication');
const authorize = require('../middleware/Authorization');

// Public routes
// API 17: GET /api/v1/events (public endpoint) - NO PROTECT NEEDED
router.get('/', getAllPublicEvents);

// Single event analytics (Organizer/Admin) - must be before '/:id' route
router.get('/:id/analytics', protect, authorize(['organizer', 'admin']), getEventAnalyticsById);

// API 19: GET /api/v1/events/:id (public endpoint) - NO PROTECT NEEDED
router.get('/:id', getEventDetails);

// Organizer routes
// API 16: create a new event (POST) /api/v1/events (Organizer)
router.post('/', protect, authorize(['organizer']), createEvent);

// API 12: GET /api/v1/users/events/analytics (Organizer)
router.get('/users/events/analytics', protect, authorize(['organizer']), getOrganizerEventAnalytics);

// Organizer's own events list
router.get('/users/events', protect, authorize(['organizer']), getOrganizerEvents);

// Admin routes
// API 18: Get list of all events (approved,pending,declined) - Admin only
router.get('/all', protect, authorize(['admin']), getAllEventsForAdmin);

// Change event status (Admin only)
router.put('/:id/status', protect, authorize(['admin']), changeEventStatus);

// Organizer/Admin routes
// API 21: DELETE /api/v1/events/:id (Organizer/Admin)
router.delete('/:id', protect, authorize(['organizer', 'admin']), deleteEvent);

// API 20: PUT /api/v1/events/:id (Organizer/Admin)
router.put('/:id', protect, authorize(['organizer', 'admin']), updateEvent);

// Book tickets (Organizer/Admin can also book, but mostly users)
// Protect route, user must be logged in
router.post('/:id/book', protect, authorize(['user', 'organizer', 'admin']), bookTickets);


module.exports = router;
