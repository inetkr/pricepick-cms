import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiResponse } from 'src/types/api_response';
import type {
  IDashboardRecentPurchase,
  IDashboardSummary,
  IDashboardTopMember,
  IDashboardTopMerchant,
} from 'src/types/dashboard/dashboard';

const tableName = 'dashboard';
export default class DashboardAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  getSummary = async (): Promise<ApiResponse<IDashboardSummary>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  };

  getRecentPurchases = async (): Promise<ApiResponse<{ rows: IDashboardRecentPurchase[] }>> => {
    try {
      const response = await axios.axiosInstance.get(`/${tableName}/admin/recent_purchases`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard recent purchases:', error);
      throw error;
    }
  };

  getTopMerchants = async (): Promise<ApiResponse<{ rows: IDashboardTopMerchant[] }>> => {
    try {
      const response = await axios.axiosInstance.get(`/${tableName}/admin/top_merchants`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard top merchants:', error);
      throw error;
    }
  };

  getTopMembers = async (): Promise<ApiResponse<{ rows: IDashboardTopMember[] }>> => {
    try {
      const response = await axios.axiosInstance.get(`/${tableName}/admin/top_members`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard top members:', error);
      throw error;
    }
  };
}
