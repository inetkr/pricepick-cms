import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { IUserStat } from 'src/types/users/user_stat';
import type { IWithdrawalStat } from 'src/types/users/withdrawal_stat';
import type { IUser } from 'src/types/users/user';
import type {
  IUpdateUserStatusPayload,
  IUserStatusHistory,
} from 'src/types/users/user_status_history';

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

  getDeletedUserStat = async (): Promise<ApiResponse<IWithdrawalStat>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/deleted_account_stats`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal statistics:', error);
      throw error;
    }
  };

  getDeletedUserList = async (
    page: number,
    limit: number,
    filter?: {
      search?: string;
    }
  ): Promise<ApiPaginatedResponse<IUser>> => {
    try {
      const requestParam: any = {
        page,
        limit,
        order: JSON.stringify([['deleted_at', 'desc']]),
      };
      if (filter) {
        requestParam.filter = JSON.stringify(filter);
      }
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/list_deleted`,
        {
          params: requestParam,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawn user list:', error);
      throw error;
    }
  };

  // 계정 상태 변경은 이 API로만 한다 — admin/update/:id 는 account_status를 거부한다. 사유 필수(최대 500자).
  updateStatus = async (
    id: string,
    payload: IUpdateUserStatusPayload
  ): Promise<ApiResponse<{ status: boolean; status_history: IUserStatusHistory }>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.put(
        `/${tableName}/admin/update_status/${id}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };

  // 최신순으로 내려온다
  getStatusHistory = async (
    id: string,
    page: number = 1,
    limit: number = 50
  ): Promise<ApiPaginatedResponse<IUserStatusHistory>> => {
    try {
      const response = await axios.axiosInstance.get(`/${tableName}/admin/status_history/${id}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user status history:', error);
      throw error;
    }
  };

  searchUserByKeyword = async (
    keyword: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiPaginatedResponse<IUser>> => {
    try {
      const response = await axios.axiosInstance.get(`/${tableName}/admin/search`, {
        params: {
          page,
          limit,
          filter: JSON.stringify({ search: keyword }),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users by keyword:', error);
      throw error;
    }
  };
}
