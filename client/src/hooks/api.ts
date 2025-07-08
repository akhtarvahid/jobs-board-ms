import axios from 'axios';
import { getToken, logout } from '../utils/tokenExpiryCheck';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API base URL
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const parsedToken = getToken();
    if (parsedToken) {
      config.headers.Authorization = `Bearer ${parsedToken.access_token ?? ''}`;
    } else {
      logout();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
