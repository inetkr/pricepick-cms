import axios from 'src/utils/axios';
import type { ApiResponse } from 'src/types/api_response';

export default class ConfigAPI {
  getConfig = async <T = any,>(key: string): Promise<ApiResponse<T>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/config/${key}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching config "${key}":`, error);
      throw error;
    }
  };

  setConfig = async <T = any,>(key: string, value: T): Promise<ApiResponse<T>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post('/config/admin/set', {
        key,
        value,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating config "${key}":`, error);
      throw error;
    }
  };

  getAppVersion = async <T = any,>(): Promise<ApiResponse<T>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get('/config/admin/app_version');
      return response.data;
    } catch (error) {
      console.error('Error fetching app version config:', error);
      throw error;
    }
  };
}
