import { ENDPOINTS } from '../utils/api.config';
import apiService from './api.service';

class AuthService {
  async login(credentials) {
    try {
      console.log('[Auth] Attempting login...');
      const response = await apiService.post(ENDPOINTS.AUTH.LOGIN, credentials);
      
      console.log('[Auth] Login response:', response);
      
      if (response && response.access) {
        apiService.setToken(response.access, response.refresh);
        console.log('[Auth] Tokens saved successfully');
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
      console.log('[Auth] Logging out...');
      
      if (refreshToken) {
        await apiService.post(ENDPOINTS.AUTH.LOGOUT, { refresh: refreshToken });
      }
    } catch (error) {
      console.error('[Auth] Logout error:', error);
    } finally {
      apiService.clearToken();
      console.log('[Auth] Tokens cleared');
    }
  }

  async getProfile() {
    try {
      console.log('[Auth] Fetching profile...');
      const profile = await apiService.get(ENDPOINTS.AUTH.PROFILE);
      console.log('[Auth] Profile fetched:', profile);
      return profile;
    } catch (error) {
      console.error('[Auth] Failed to fetch profile:', error);
      throw error;
    }
  }

  //Let's get all users from the database
  // async getAllUsers(){
  //   try{
  //     const users = await apiService.get()
  //   }
  // }

  async refreshToken() {
    try {
      const refreshToken = apiService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post(ENDPOINTS.AUTH.TOKEN_REFRESH, {
        refresh: refreshToken
      });

      if (response && response.access) {
        apiService.setToken(response.access);
        return response.access;
      }

      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('[Auth] Token refresh failed:', error);
      apiService.clearToken();
      throw error;
    }
  }

  isAuthenticated() {
    return !!apiService.getToken();
  }
}

export default new AuthService();