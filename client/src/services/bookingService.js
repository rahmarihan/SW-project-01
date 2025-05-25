import api from './api';

const bookTickets = (eventId, quantity, userId) => {
  return api.post('/bookings', { eventId, quantity, userId })
    .then(res => res.data);
};

const getUserBookings = () => {
  return api.get('/bookings/user-bookings')
    .then(res => res.data.data); // .data.data because backend returns { data: [...] }
};

const getBookingDetails = (bookingId) => {
  return api.get(`/bookings/${bookingId}`)
    .then(res => res.data);
};

const cancelBooking = (bookingId) => {
  return api.delete(`/bookings/${bookingId}`)
    .then(res => res.data);
};

const bookingService = {
  bookTickets,
  getUserBookings,
  getBookingDetails,
  cancelBooking
};

export default bookingService;