const express = require('express');
const router = express.Router();
const {
  getOrganizerEventAnalytics,
  getSingleEvent,
  updateEventDetails,
  deleteEvent,
  getOrganizerEvents,
  changeEventStatus,
  createEvent,             // ✅ Add this
  getAllEvents             // ✅ Add this
} = require('../Controllers/eventController');



const  protect =  require('../middleware/Authentication');
const  authorize = require('../middleware/Authorization');



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



// router.get(
//   '/users/events',  // ✅ removed space
//   authenticate,
//   authorize('organizer'),
//   getOrganizerEvents
// );

module.exports = router;




