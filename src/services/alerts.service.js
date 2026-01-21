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
            
            const response = await apiService.get(url);
            
            // Handle Django pagination vs Array response
            if (response && response.results && Array.isArray(response.results)) {
                return response.results;
            } else if (Array.isArray(response)) {
                return response;
            }
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

    /**
     * Mark multiple alerts as resolved
     * @param {number[]} alertIds 
     */
    async resolveAll(alertIds) {
        try {
            // Execute all resolve requests in parallel
            const promises = alertIds.map(id => this.resolveAlert(id));
            return await Promise.all(promises);
        } catch (error) {
            console.error('[AlertService] Failed to resolve all selected alerts:', error);
            throw error;
        }
    }

    /**
     * Delete an alert permanently
     * @param {number} alertId 
     */
    async deleteAlert(alertId) {
        try {
            // Assumes standard REST path /api/alerts/{id}/
            // We append the ID to the LIST endpoint
            const url = `${ENDPOINTS.ALERTS.LIST}${alertId}/`;
            return await apiService.delete(url);
        } catch (error) {
            console.error('[AlertService] Failed to delete alert:', error);
            throw error;
        }
    }
}

export default new AlertService();