import { ENDPOINTS } from "../utils/api.config";
import apiService from "./api.service";

class AlertService {
    /**
     * Get alerts with optional filtering
     * @param {Object} params - { resolved: boolean, severity: 'low'|'medium'|'high' }
     */
    async getAlerts(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.resolved !== undefined) queryParams.append('resolved', params.resolved);
            if (params.severity) queryParams.append('severity', params.severity);
            
            const url = `${ENDPOINTS.ALERTS.LIST}?${queryParams.toString()}`;
        
            console.log(`[AlertService] Requesting: ${url}`);
            
            const response = await apiService.get(url);
            
            console.log('[AlertService] Raw API Response:', response);
            
            if (response && response.results && Array.isArray(response.results)) {
                console.log('[AlertService] Detected Paginated Response. Count:', response.results.length);
                return response.results;
            } else if (Array.isArray(response)) {
                console.log('[AlertService] Detected Array Response. Count:', response.length);
                return response;
            }
            
            console.warn('[AlertService] Response format unrecognized, returning empty array.');
            return [];
            
        } catch (error) {
            console.error('[AlertService] Failed to fetch alerts:', error);
            return [];
        }
    }

    /**
     * Mark an alert as resolved
     * @param {number} alertId 
     */
    async resolveAlert(alertId) {
        try {
            const url = ENDPOINTS.ALERTS.RESOLVE(alertId);
            return await apiService.post(url, {});
        } catch (error) {
            console.error('[AlertService] Failed to resolve alert:', error);
            throw error;
        }
    }
}

export default new AlertService();