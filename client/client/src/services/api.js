import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "mongodb://localhost:27017/event_ticketing", // ✅ Replace with your actual backend URL
});

// Automatically attach token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
