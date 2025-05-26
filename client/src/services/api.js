import axios from 'axios';

// Create Axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Adjust as needed
  baseURL: "http://localhost:5000/api/v1", // ✅ Replace with your actual backend URL
});

// Attach token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
const login = (credentials) => api.post('/login', credentials);
const register = (data) => api.post('/register', data);
const forgotPassword = (data) => api.put('/forgetPassword', data);
const logout = () => api.post('/auth/logout'); // Optional endpoint if you have it

// Event APIs
const getEvents = () => api.get('/events');
const getEventDetails = (id) => api.get(`/events/${id}`);
const bookTicket = (eventId) => api.post(`/events/${eventId}/book`);
const getAnalytics = () => api.get('/users/events/analytics');

// Organizer APIs
const getApprovedEvents = (searchTerm = "", filter = {}) => {
  const params = {
    status: "approved",
    ...filter,
    ...(searchTerm && { search: searchTerm }),
  };
  return api.get("/events", { params }).then(res => res.data);
};

const getMyEvents = () => api.get("/users/events").then(res => res.data);

//const getMyEvents = () => api.get("/events/my").then(res => res.data);

const deleteEvent = (id) => api.delete(`/events/${id}`);

const createEvent = (eventData) => api.post('/events', eventData);

const updateEvent = (id, eventData) => api.put(`/events/${id}`, eventData);



// Booking APIs
const bookTickets = (eventId, numberOfTickets) =>
  api.post('/bookings', { eventId, numOfTickets: numberOfTickets }).then(res => res.data);

const getUserBookings = () =>
  api.get('/bookings/user-bookings').then(res => res.data.data);

const getBookingDetails = (bookingId) =>
  api.get(`/bookings/${bookingId}`).then(res => res.data);

const cancelBooking = (bookingId) =>
  api.delete(`/bookings/${bookingId}`).then(res => res.data);

// ✅ Profile API
export const updateProfile = (data) => api.put('/users/profile', data);

// Get all events (public)
const getAllEvents = () => api.get('/events/all');
const getAllUsers = () => api.get('/users');
const updateUserRole = (id, role) => api.put(`/users/${id}`, { role });
const deleteUser = (id) => api.delete(`/users/${id}`);

// Export all functions in a single object
export default {
  login,
  register,
  forgotPassword,
  logout,
  getEvents,
  getEventDetails,
  bookTicket,
  getApprovedEvents,
  getMyEvents,
  deleteEvent,
  createEvent,
  updateEvent,
  getAnalytics,
};

// Export axios instance separately
export { api };
