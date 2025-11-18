import { ENDPOINTS } from "../utils/api.config";
import apiService from "./api.service";

class UserService{
    async getAllUsers(){
        try{
            const response = await apiService.get(ENDPOINTS.AUTH.USERS);
            return response;
        } catch(error){
            console.error('[UserService] Failed to fetch users:', error);
            throw error;
        }
    }

    async getUserById(id){
        try{
            const response = await apiService.get(`${ENDPOINTS.AUTH.USERS}/${id}`);
            return response;
        } catch(error){
            console.error('[UserService] Failed to fetch user:', error);
            throw error;
        }
    }
}

export default new UserService();