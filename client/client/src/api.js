// src/api/api.js

import axios from "axios";

// Create a reusable axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1", // change this to your backend URL if deployed
  withCredentials: true, // allows sending cookies if your backend uses them
});

// GET approved events with optional search & filtering
export const getApprovedEvents = async (searchTerm = "", filter = {}) => {
  const params = {
    status: "approved", // Only fetch approved events
    ...filter,
    ...(searchTerm && { search: searchTerm }), // Include search param if provided
  };

  const response = await api.get("/events", { params });
  return response.data;
};

// GET events created by the logged-in organizer
export const getMyEvents = async () => {
  const response = await api.get("/events/my"); // Assumes backend filters by logged-in user
  return response.data;
};

// DELETE an event by ID
export const deleteEvent = async (id) => {
  await api.delete(`/events/${id}`);
};

export default api;
