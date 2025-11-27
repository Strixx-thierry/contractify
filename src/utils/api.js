import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/users'
});

// Request interceptor to add JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (userData) => {
  return api.post('/signup', userData);
};

export const loginUser = async (credentials) => {
  return api.post('/login', credentials);
};

export const logoutUser = async () => {
  return api.post('/logout');
};

export const getCurrentUser = async () => {
  return api.get('/me');
};
