import apiService from "./api.service";
import { ENDPOINTS } from "../utils/api.config";

class DeviceService {

  async getDevices() {
    try {
      return await apiService.get(ENDPOINTS.EDGE_DEVICES.LIST);
    } catch (error) {
      console.error('[DeviceService] Failed to fetch devices:', error);
      throw error;
    }
  }

  async getDevice(id) {
    try {
      return await apiService.get(ENDPOINTS.EDGE_DEVICES.DETAIL(id));
    } catch (error) {
      console.error('[DeviceService] Failed to fetch device:', error);
      throw error;
    }
  }

  async createDevice(data) {
    try {
      return await apiService.post(ENDPOINTS.EDGE_DEVICES.LIST, data);
    } catch (error) {
      console.error('[DeviceService] Failed to create device:', error);
      throw error;
    }
  }

  async updateDevice(id, data) {
    try {
      return await apiService.patch(ENDPOINTS.EDGE_DEVICES.DETAIL(id), data);
    } catch (error) {
      console.error('[DeviceService] Failed to update device:', error);
      throw error;
    }
  }

  async deleteDevice(id) {
    try {
      return await apiService.delete(ENDPOINTS.EDGE_DEVICES.DETAIL(id));
    } catch (error) {
      console.error('[DeviceService] Failed to delete device:', error);
      throw error;
    }
  }
}

export default new DeviceService();
