const isDev = import.meta.env.MODE === 'development';

export const API_CONFIG = {
  BASE_URL: isDev
    ? 'http://localhost:8000'
    : 'http://poultrix-backend.ap-southeast-2.elasticbeanstalk.com', 
  TIMEOUT: 5000,
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    LOGOUT: '/api/auth/logout/',
    PROFILE: '/api/auth/profile/',
    USERS: '/api/auth/users/',
    FARMERS: '/api/auth/users/farmers/',
  },

  FARM: {
    LIST: '/api/farm/farms/',
    DETAIL: (id) => `/api/farm/farms/${id}/`,
    COOPS: '/api/farm/coops/',
  },

  SENSORS: {
    HISTORY: '/api/sensors/sensor-reading/',
    LIVE: '/api/sensors/sensor-reading/',
    HEALTH: '/api/sensors/poo-health-latest/',
  },

  ALERTS: {
    LIST: '/api/alerts/',
    RESOLVE: (id) => `/api/alerts/${id}/resolve/`,
  },
  EDGE_DEVICES: {
    LIST: '/api/farm/edge-devices/',
    DETAIL: (id) => `/api/farm/edge-devices/${id}/`,
  },
};
