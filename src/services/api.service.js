import { API_CONFIG } from '../utils/api.config';

class ApiService {
  constructor() {
    this.isRefreshing = false;
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      method: options.method || 'GET',
      headers,
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      console.log(`[API Request] ${config.method} ${API_CONFIG.BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config);
      
      // Try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = null;
      }

      // Handle 401 Unauthorized
      if (response.status === 401 && !this.isRefreshing) {
        this.isRefreshing = true;
        console.log('[API] Unauthorized - clearing tokens');
        this.clearToken();
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/';
          this.isRefreshing = false;
        }, 100);
        
        return null;
      }

      if (!response.ok) {
        console.error(`[API Error] ${response.status}:`, data);
        throw { 
          response: data, 
          status: response.status,
          message: data?.detail || data?.error || 'An error occurred'
        };
      }

      console.log(`[API Response] ${response.status}:`, data);
      return data;
      
    } catch (error) {
      if (error.response || error.status) {
        // Already formatted error
        throw error;
      }
      
      // Network or other errors
      console.error('[API Error]:', error);
      throw {
        response: { error: 'Network error or server is down' },
        status: 0,
        message: 'Unable to connect to server'
      };
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  setToken(accessToken, refreshToken = null) {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  clearToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
}

export default new ApiService();