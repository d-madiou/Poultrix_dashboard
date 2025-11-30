import { ENDPOINTS } from "../utils/api.config";
import apiService from "./api.service";

class FarmService {
    async getAllFarms() {
        try {
            const response = await apiService.get(ENDPOINTS.FARM.LIST);
            return response;
        } catch (error) {
            console.error('[FarmService] Failed to fetch farms:', error);
            throw error;
        }
    }

    async getFarmById(id) {
        try {
            return await apiService.get(ENDPOINTS.FARM.DETAIL(id));
        } catch (error) {
            console.error('[FarmService] Failed to fetch farm:', error);
            throw error;
        }
    }

    async createFarm(farmData) {
        try {
            return await apiService.post(ENDPOINTS.FARM.LIST, farmData);
        } catch (error) {
            console.error('[FarmService] Failed to create farm:', error);
            throw error;
        }
    }

    async createCoop(coopData) {
        try {
            return await apiService.post(ENDPOINTS.FARM.COOPS, coopData);
        } catch (error) {
            console.error('[FarmService] Failed to create coop:', error);
            throw error;
        }
    }
}

export default new FarmService();