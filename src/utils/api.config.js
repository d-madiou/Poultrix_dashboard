const isDev = import.meta.env.MODE === 'development';

export const API_CONFIG = {
  BASE_URL: isDev
    ? 'http://localhost:8000'
    : 'https://api.yourproductiondomain.com/api',
  TIMEOUT: 5000,
};

export const ENDPOINTS = {
  AUTH: {
     LOGIN: '/api/auth/login/',          
     LOGOUT: '/api/auth/logout/',         
     PROFILE: '/api/auth/profile/',
     USERS: '/api/auth/users/',
  },
};