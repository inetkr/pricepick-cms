import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { IRevenueStat } from 'src/types/revenue/revenue_stat';
import type { IFeeRevenue, IGifticonRevenue } from 'src/types/revenue/revenue';

const tableName = 'revenue';
export default class RevenueAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  getRevenueStat = async (): Promise<ApiResponse<IRevenueStat>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue statistics:', error);
      throw error;
    }
  };

  getFeeRevenueList = async (
    page: number,
    limit: number,
    filter?: {
      search?: string;
      mall?: string;
    }
  ): Promise<ApiPaginatedResponse<IFeeRevenue>> => {
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
        `/${tableName}/admin/list_fee_revenue`,
        {
          params: requestParam,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching fee revenue list:', error);
      throw error;
    }
  };

  getGifticonRevenueList = async (
    page: number,
    limit: number,
    filter?: {
      search?: string;
    }
  ): Promise<ApiPaginatedResponse<IGifticonRevenue>> => {
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
        `/${tableName}/admin/list_gifticon_revenue`,
        {
          params: requestParam,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching gifticon revenue list:', error);
      throw error;
    }
  };
}
