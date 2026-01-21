// sensor.services.js
import { ENDPOINTS } from "../utils/api.config";
import apiService from "./api.service";

class SensorService {
    // 1. Get Live Aggregated Data (Dashboard)
    async getLiveReadings() {
        try {
            return await apiService.get(ENDPOINTS.SENSORS.LIVE);
        } catch (error) {
            console.error('[SensorsService] Failed to fetch live readings:', error);
            throw error;
        }
    }

    // 2. Get Camera/Health Data (Dashboard)
    async getHealthChecks() {
        try {
            return await apiService.get(ENDPOINTS.SENSORS.HEALTH);
        } catch (error) {
            console.error('[SensorsService] Failed to fetch health checks:', error);
            throw error;
        }
    }

    // 3. Get Historical Data (Charts)
    async getHistoricalReadings() {
        try {
            return await apiService.get(ENDPOINTS.SENSORS.HISTORY);
        } catch (error) {
            console.error('[SensorsService] Failed to fetch history:', error);
            throw error;
        }
    }
}

export default new SensorService();