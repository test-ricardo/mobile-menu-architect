import axios from 'axios';
import { deleteCookie } from '@/utils/cookie';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      deleteCookie('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
