import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust as needed
  withCredentials: true, // to send cookies
});

export default api;