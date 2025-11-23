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
    HISTORY: '/api/sensors/sensor-reading/',
    LIVE: '/api/sensors/sensor-reading/',
    HEALTH: '/api/sensors/poo-health-latest/',
  },
  ALERTS: {
    LIST: '/api/alerts/',
    RESOLVE: (id) => `/api/alerts/${id}/resolve/`,
  }
};