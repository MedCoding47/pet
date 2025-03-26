import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Ensure this matches your Laravel backend URL
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('admin-token')}`,
  },
});

export default api;