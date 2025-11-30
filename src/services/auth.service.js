import { ENDPOINTS } from '../utils/api.config';
import apiService from './api.service';

class AuthService {
  async login(credentials) {
    try {
      console.log('[Auth] Attempting login...');
      const response = await apiService.post(ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response && response.access) {
        // Use the helper method
        apiService.setToken(response.access, response.refresh);
        
        // Save User Details (Role)
        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        return response;
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('[Auth] Login failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const refreshToken = apiService.getRefreshToken();
      if (refreshToken) {
        await apiService.post(ENDPOINTS.AUTH.LOGOUT, { refresh: refreshToken });
      }
    } catch (error) {
      console.warn('[Auth] Logout API call failed (session might already be expired)');
    } finally {
      apiService.clearToken();
    }
  }

  async getProfile() {
    try {
      const profile = await apiService.get(ENDPOINTS.AUTH.PROFILE);
      if (profile) {
        localStorage.setItem('user', JSON.stringify(profile));
      }
      return profile;
    } catch (error) {
      console.error('[Auth] Failed to fetch profile:', error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = apiService.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const response = await apiService.post(ENDPOINTS.AUTH.USERS + 'token/refresh/', {
        refresh: refreshToken
      });

      if (response && response.access) {
        apiService.setToken(response.access); // Only updates access token
        return response.access;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      apiService.clearToken();
      throw error;
    }
  }

  isAuthenticated() {
    return !!apiService.getToken();
  }
}

export default new AuthService();