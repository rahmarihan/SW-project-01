const express = require('express');
const router = express.Router();
const {
  getOrganizerEventAnalytics,
  deleteEvent,
  getOrganizerEvents,
  changeEventStatus,
  createEvent,
  getAllPublicEvents,
  getEventDetails,
  updateEvent,
} = require('../Controllers/eventController');

// Import your authentication and authorization middleware
const protect = require('../middleware/Authentication');
const authorize = require('../middleware/Authorization');

// API 16: create a new event (POST) /api/v1/events (Organizer)
router.post('/', protect, authorize(['organizer']), createEvent);

// API 17: GET /api/v1/events (public endpoint) - NO PROTECT NEEDED
router.get('/', getAllPublicEvents);

// API 18: GET /api/v1/events/:id (public endpoint) - NO PROTECT NEEDED
router.get('/:id', getEventDetails);

// API 20: DELETE /api/v1/events/:id (Organizer/Admin)
router.delete('/:id', protect, authorize(['organizer', 'admin']), deleteEvent);

// API 19: PUT /api/v1/events/:id (Organizer/Admin)
router.put('/:id', protect, authorize(['organizer', 'admin']), updateEvent);

// API 12: GET /api/v1/users/events/analytics (Organizer)
router.get('/users/events/analytics', protect, authorize(['organizer']), getOrganizerEventAnalytics);

router.get('/users/events', protect, authorize(['organizer']), getOrganizerEvents);
router.put('/:id/status', protect, authorize(['admin']), changeEventStatus);

module.exports = router;
