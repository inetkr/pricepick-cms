import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { IUserStat } from 'src/types/users/user_stat';
import type { IUser } from 'src/types/users/user';

const tableName = 'user';
export default class UserAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  getUserStat = async (): Promise<ApiResponse<IUserStat>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  };

  getUserList = async (
    page: number,
    limit: number,
    filter?: {
      search?: string;
      kakao_status?: string;
      account_status?: string;
      marketing_consent?: string;
    }
  ): Promise<ApiPaginatedResponse<IUser>> => {
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
      console.error('Error fetching user list:', error);
      throw error;
    }
  };
}
