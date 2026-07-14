import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiResponse } from 'src/types/api_response';
import type { IStatsSummary } from 'src/types/stats/stats';

const tableName = 'statistic';
export default class StatsAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  getStatsSummary = async (period?: string): Promise<ApiResponse<IStatsSummary>> => {
    try {
      const requestParam: any = {};
      if (period) {
        requestParam.period = period;
      }
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/summary`, {
        params: requestParam,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics summary:', error);
      throw error;
    }
  };
}
