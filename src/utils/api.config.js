// api.config.js
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
  FARM: {
    LIST: '/api/farms/',
    DETAIL: (id) => `/api/farms/${id}/`,
    COOPS: '/api/coops/',
  },
  SENSORS: {
    // 1. For Charts (Historical Data)
    HISTORY: '/api/sensors/webhook/', 
    // 2. For Dashboard Cards (Live Averages)
    LIVE: '/api/sensors/live-readings/', 
    // 3. For Camera Status (Health Checks)
    HEALTH: '/api/sensors/health-checks/',
  }
};