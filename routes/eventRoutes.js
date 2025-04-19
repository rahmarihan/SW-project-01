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
  updateEvent,          // ✅ Add this
} = require('../Controllers/eventController');



const  protect =  require('../middleware/Authentication');
const  authorize = require('../middleware/Authorization');



// API 12: GET /api/v1/users/events/analytics (Organizer)
router.get('/users/events/analytics', protect, authorize('organizer'), getOrganizerEventAnalytics);

// API 18: GET /api/v1/events/:id (Public)
//router.get('/:id', getSingleEvent);

// API 19: PUT /api/v1/events/:id (Organizer/Admin)
//router.put('/:id', protect, authorize('organizer', 'admin'), updateEventDetails);

//elena´s api
//API 16: create a new event (POST) /api/v1/events (Organizer)
router.post('/',protect,authorize('organizer'), createEvent);

//API 17: GET /api/v1/events (public endpoint)
router.get('/', getAllPublicEvents); 

//API 18: GET /api/v1/events/:id (public endpoint)
router.get('/:id', getEventDetails); 

// API 19: PUT /api/v1/events/:id (Organizer/Admin)
router.put('/:id',protect,updateEvent );

// API 20: DELETE /api/v1/events/:id (Organizer/Admin)
router.delete('/:id', protect, deleteEvent);

// Keep your existing api routes
router.get('/organizer/events', protect, authorize('organizer'), getOrganizerEvents);
router.put('/:id/status', protect, authorize('admin'), changeEventStatus);
router.delete('',)



//16
//router.post('/', authorize('organizer'),createEvent);
//17
//router.get('/', getAllEvents);



// router.get(
//   '/users/events',  // ✅ removed space
//   authenticate,
//   authorize('organizer'),
//   getOrganizerEvents
// );

module.exports = router;




