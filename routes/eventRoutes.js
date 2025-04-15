const express = require('express');
const router = express.Router();
const {
  getOrganizerEventAnalytics, // API 1
  getSingleEvent,             // API 2
  updateEventDetails,         // API 3
  deleteEvent,                // API 4
  // Your existing functions...
  getOrganizerEvents,
  changeEventStatus
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

// API 1: GET /api/v1/users/events/analytics (Organizer)
router.get('/api/v1/users/events/analytics', protect, authorize('organizer'), getOrganizerEventAnalytics);

// API 2: GET /api/v1/events/:id (Public)
router.get('/api/v1/events/:id', getSingleEvent);

// API 3: PUT /api/v1/events/:id (Organizer/Admin)
router.put('/api/v1/events/:id', protect, authorize('organizer', 'admin'), updateEventDetails);

// API 4: DELETE /api/v1/events/:id (Organizer/Admin)
router.delete('/api/v1/events/:id', protect, authorize('organizer', 'admin'), deleteEvent);


router.get('/organizer/events', protect, authorize('organizer'), getOrganizerEvents);
router.put('/:id/status', protect, authorize('admin'), changeEventStatus);

module.exports = router;