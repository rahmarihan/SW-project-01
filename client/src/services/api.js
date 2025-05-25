import axios from 'axios';

// Create Axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1", // 🔁 Replace with your actual backend URL if needed
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
const logout = () => api.post('/auth/logout'); // Optional: only if backend supports logout

// Event APIs
const getEvents = () => api.get('/events');

const getEventDetails = (id) => api.get(`/events/${id}`);

const bookTicket = (eventId, numOfTickets) =>
  api.post('/bookings', { eventId, numOfTickets });

// Organizer APIs
const getApprovedEvents = async (searchTerm = "", filter = {}) => {
  const params = {
    status: "approved",
    ...filter,
    ...(searchTerm && { search: searchTerm }),
  };
  const response = await api.get("/events", { params });
  return response.data;
};

const getMyEvents = async () => {
  const response = await api.get("/events/my");
  return response.data;
};

const deleteEvent = async (id) => {
  await api.delete(`/events/${id}`);
};

// Export all functions in a single object
export default {
  login,
  register,
  forgotPassword,
  logout,
  getEvents,
  getEventDetails,   // ✅ Newly added function
  bookTicket,
  getApprovedEvents,
  getMyEvents,
  deleteEvent,
};
