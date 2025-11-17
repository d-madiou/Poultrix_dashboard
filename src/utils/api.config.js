const isDev = process.env.NODE_ENV === 'development'

export const API_CONFIG = {
  BASE_URL: isDev
    ? 'http://localhost:8000/api/'
    : 'https://api.yourproductiondomain.com/api',
  TIMEOUT: 5000,
};

const ENDPOINTS = {
    DASHBOARD: {
        ADMIN: '/admin/'
    }
}

export { ENDPOINTS }