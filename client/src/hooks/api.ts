import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API base URL
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('persist:token') ?? '');
    const parsedToken = JSON.parse(token.token); // Or get token from your preferred storage
    if (token) {
      config.headers.Authorization = `Bearer ${parsedToken.access_token ?? ''}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
