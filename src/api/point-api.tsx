import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { IPointStat } from 'src/types/points/point_stat';
import type { IPoint } from 'src/types/points/point';

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

  getPointList = async (
    page: number,
    limit: number,
    filter?: {
      search?: string;
      type?: string;
      period?: string;
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
        `/${tableName}/admin/get_list_cms`,
        {
          params: requestParam,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching point list:', error);
      throw error;
    }
  };
}
