import axios from 'src/utils/axios';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { ICreatePolicyPayload, IPolicy, IUpdatePolicyPayload } from 'src/types/policy';
import type { IPolicyType } from 'src/types/common';

const tableName = 'policy';

export default class PolicyAPI {
  getPolicyList = async (
    page: number,
    limit: number,
    filter?: { title?: string; is_published?: boolean }
  ): Promise<ApiPaginatedResponse<IPolicy>> => {
    try {
      const requestParam: any = {
        page,
        limit,
        field: JSON.stringify(['$all']),
        order: JSON.stringify([['created_at', 'desc']]),
      };
      if (filter) {
        requestParam.filter = JSON.stringify(filter);
      }
      const res = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/get_list_cms`, {
        params: requestParam,
      });
      return res.data;
    } catch (error) {
      console.error('Failed to fetch policy list:', error);
      throw error;
    }
  };

  getPolicyByType = async (type: IPolicyType): Promise<ApiResponse<IPolicy>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/by_type/${type}`);
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch policy by type (${type}):`, error);
      throw error;
    }
  };

  createPolicy = async (body: ICreatePolicyPayload): Promise<ApiResponse<IPolicy>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.post(`/${tableName}/admin/create`, body);
      return res.data;
    } catch (error) {
      console.error('Failed to create policy:', error);
      throw error;
    }
  };

  updatePolicy = async (id: string, body: IUpdatePolicyPayload): Promise<ApiResponse<IPolicy>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.put(`/${tableName}/${id}`, body);
      return res.data;
    } catch (error) {
      console.error('Failed to update policy:', error);
      throw error;
    }
  };

  deletePolicy = async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.delete(`/${tableName}/${id}`);
      return res.data;
    } catch (error) {
      console.error('Failed to delete policy:', error);
      throw error;
    }
  };
}
