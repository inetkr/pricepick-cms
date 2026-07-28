import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { IInvite } from 'src/types/invites/invite';
import type { IInviteStat } from 'src/types/invites/invite_stat';

const tableName = 'referral';
export default class InviteAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  getInviteStat = async (): Promise<ApiResponse<IInviteStat>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invite statistics:', error);
      throw error;
    }
  };

  getInviteRanking = async (
    page: number,
    limit: number
  ): Promise<ApiPaginatedResponse<IInvite>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/top_inviters`,
        {
          params: {
            page,
            limit,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching invite ranking:', error);
      throw error;
    }
  };
}
