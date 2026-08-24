import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { IPointStat } from 'src/types/points/point_stat';
import type { IPoint } from 'src/types/points/point';
import type { IAttendanceStat } from 'src/types/points/attendance_stat';
import type { IConversionRates } from 'src/types/points/conversion_rate';
import type { IPointPolicyConfig } from 'src/types/config/point_policy_config';

const tableName = 'point';
export default class PointAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  getPointStat = async (): Promise<ApiResponse<IPointStat>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching point statistics:', error);
      throw error;
    }
  };

  getPointAttendanceStats = async (): Promise<ApiResponse<IAttendanceStat>> => {
    try {
      const response = await axios.axiosInstance.get(`/${tableName}/admin/attendance_stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching point attendance statistics:', error);
      throw error;
    }
  };

  getPointHistoryList = async (
    page: number,
    limit: number,
    filter?: {
      search?: string;
      category?: string;
      days?: number;
      from_date?: string;
      to_date?: string;
    }
  ): Promise<ApiPaginatedResponse<IPoint>> => {
    try {
      const requestParam: any = {
        page,
        limit,
        order: JSON.stringify([['created_at', 'desc']]),
      };
      if (filter) {
        requestParam.filter = JSON.stringify(filter);
      }
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/list_point_history`,
        {
          params: requestParam,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching point history list:', error);
      throw error;
    }
  };

  getConversionRates = async (): Promise<ApiResponse<IConversionRates>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/conversion_rates`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching point conversion rates:', error);
      throw error;
    }
  };

  getPointPolicy = async (): Promise<ApiResponse<IPointPolicyConfig>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/point_policy`);
      return response.data;
    } catch (error) {
      console.error('Error fetching point policy:', error);
      throw error;
    }
  };

  addSubPoint = async (data: {
    user_identifier: string; // user_id 또는 username
    action: 'ADMIN_ADD' | 'ADMIN_SUB';
    amount: number;
    description: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post(
        `/${tableName}/admin/add_sub_point`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error adding/subtracting point:', error);
      throw error;
    }
  };
}
