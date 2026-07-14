import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiResponse } from 'src/types/api_response';
import type { ISettlementStat } from 'src/types/settlement/settlement_stat';
import type {
  IAffiliateSettlement,
  IMonthlySettlement,
  ISettlementDiffReason,
} from 'src/types/settlement/settlement';

const tableName = 'settlement';
export default class SettlementAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  getSettlementStat = async (): Promise<ApiResponse<ISettlementStat>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching settlement statistics:', error);
      throw error;
    }
  };

  getAffiliateSettlementList = async (filter?: {
    month?: string;
  }): Promise<ApiResponse<IAffiliateSettlement[]>> => {
    try {
      const requestParam: any = {};
      if (filter) {
        requestParam.filter = JSON.stringify(filter);
      }
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/list_affiliate_settlement`,
        {
          params: requestParam,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching affiliate settlement list:', error);
      throw error;
    }
  };

  getMonthlySettlementList = async (filter?: {
    limit?: number;
  }): Promise<ApiResponse<IMonthlySettlement[]>> => {
    try {
      const requestParam: any = {};
      if (filter) {
        requestParam.filter = JSON.stringify(filter);
      }
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/list_monthly_settlement`,
        {
          params: requestParam,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly settlement list:', error);
      throw error;
    }
  };

  getSettlementDiffReasons = async (filter?: {
    month?: string;
  }): Promise<ApiResponse<ISettlementDiffReason[]>> => {
    try {
      const requestParam: any = {};
      if (filter) {
        requestParam.filter = JSON.stringify(filter);
      }
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/diff_reasons`,
        {
          params: requestParam,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching settlement diff reasons:', error);
      throw error;
    }
  };
}
