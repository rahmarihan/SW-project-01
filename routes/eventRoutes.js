const express = require('express');
const router = express.Router();
const {
  getOrganizerEvents,
  updateEvent,
  changeEventStatus,
  getEventAnalytics
} = require('../controllers/eventController');

const { protect, authorize } = require('middleware\Authentication.js');

// Part C Routes
router.get('/organizer/events', protect, authorize('organizer'), getOrganizerEvents);
router.put('/:id', protect, authorize('organizer'), updateEvent);
router.get('/organizer/analytics', protect, authorize('organizer'), getEventAnalytics);
router.put('/:id/status', protect, authorize('admin'), changeEventStatus);

router.post('/', authorize('organizer'),createEvent);

router.get('/', getAllEvents);

module.exports = router;