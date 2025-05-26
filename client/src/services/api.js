import axios from 'axios';

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

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
const logout = () => api.post('/auth/logout');

// Event APIs
const getEvents = () => api.get('/events');
const getEventDetails = (id) => api.get(`/events/${id}`);
const bookTicket = (eventId) => api.post(`/events/${eventId}/book`);

const getApprovedEvents = async (searchTerm = '', filter = {}) => {
  const params = {
    status: 'approved',
    ...filter,
    ...(searchTerm && { search: searchTerm }),
  };
  const response = await api.get('/events', { params });
  return response.data;
};

const getMyEvents = async () => {
  const response = await api.get('/users/events');
  return response.data;
};

const deleteEvent = async (id) => {
  await api.delete(`/events/${id}`);
};

// Booking APIs
const bookTickets = (eventId, numberOfTickets) =>
  api.post('/bookings', { eventId, numOfTickets: numberOfTickets }).then((res) => res.data);

const getUserBookings = () =>
  api.get('/bookings/user-bookings').then((res) => res.data.data);

const getBookingDetails = (bookingId) =>
  api.get(`/bookings/${bookingId}`).then((res) => res.data);

const cancelBooking = (bookingId) =>
  api.delete(`/bookings/${bookingId}`).then((res) => res.data);

// User APIs
export const updateProfile = (data) => api.put('/users/profile', data);

const getAllEvents = () => api.get('/events/all');
const getAllUsers = () => api.get('/users');
const updateUserRole = (id, role) => api.put(`/users/${id}`, { role });
const deleteUser = (id) => api.delete(`/users/${id}`);
const updateEventStatus = (id, status) => api.put(`/events/${id}/status`, { status });

// Analytics API
const getAnalytics = () => api.get('/events/users/events/analytics');

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
  updateProfile,
  bookTickets,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  getAllEvents,
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateEventStatus,
  getAnalytics,
};
