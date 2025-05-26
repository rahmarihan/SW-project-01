
// 🔵 apiAndProtectedRoute.js

// --- Axios API service ---
import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
  const response = await api.get('/events/my');
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

// --- ProtectedRoute component ---
export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Export all APIs
export const apiService = {
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
};
