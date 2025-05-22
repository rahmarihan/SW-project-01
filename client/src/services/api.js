import axios from 'axios';

// Create Axios instance with base URL
const api = axios.create({

  baseURL: "http://localhost:5000/api/v1", // ✅ Replace with your actual backend URL

});

// Add token from localStorage (or wherever you store it) to headers
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // or get from context/state
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// API methods
const login = (credentials) => api.post('/login', credentials);

const register = (data) => api.post('/register', data);

const forgotPassword = (email) => api.post('/forgetPassword', { email });

const getEvents = () => api.get('/events');

const bookTicket = (eventId) => api.post(`/events/${eventId}/book`);

const logout = () => {
  // If your backend supports a logout endpoint, call it here
  return api.post('/auth/logout');
};

export default {
  login,
  register,
  forgotPassword,
  getEvents,
  bookTicket,
  logout,
};
