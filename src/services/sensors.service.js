import { ENDPOINTS } from "../utils/api.config";
import apiService from "./api.service";


class SensorService{
    async getLocalReadings(coopId = null){
        try{
            const url = coopId
                ? `${ENDPOINTS.SENSORS.LOCAL_READINGS}?coop_id=${coopId}`
                : ENDPOINTS.SENSORS.LOCAL_READINGS;
            return await apiService.get(url);
        } catch(error){
            console.error('[SensorsService] Failed to fetch local readings:', error);
            throw error;
        }
    }
}

export default new SensorService();