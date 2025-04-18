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


const { protect, authorize } = require('../middleware/Authentication.js');


// API 1: GET /api/v1/users/events/analytics (Organizer)
router.get('/users/events/analytics', protect, authorize('organizer'), getOrganizerEventAnalytics);

// API 2: GET /api/v1/events/:id (Public)
router.get('/:id', getSingleEvent);

// API 3: PUT /api/v1/events/:id (Organizer/Admin)
router.put('/:id', protect, authorize('organizer', 'admin'), updateEventDetails);

// API 4: DELETE /api/v1/events/:id (Organizer/Admin)
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

// Keep your existing routes
router.get('/organizer/events', protect, authorize('organizer'), getOrganizerEvents);
router.put('/:id/status', protect, authorize('admin'), changeEventStatus);


router.post('/', authorize('organizer'),createEvent);

router.get('/', getAllEvents);

module.exports = router;
