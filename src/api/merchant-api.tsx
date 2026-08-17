import axios from 'src/utils/axios';
import type { ApiResponse } from 'src/types/api_response';
import type {
  IMerchant,
  IMerchantCategoriesResult,
  IMerchantCreatePayload,
  IMerchantListResult,
  IMerchantUpdateMultiPayload,
  IMerchantUpdatePayload,
} from 'src/types/merchants/merchant';

const tableName = 'merchant';
export default class MerchantAPI {
  getList = async (params: {
    page: number;
    limit: number;
    filter?: Record<string, unknown>;
    order?: [string, 'asc' | 'desc'][];
  }): Promise<ApiResponse<IMerchantListResult>> => {
    try {
      const requestParam: Record<string, unknown> = { page: params.page, limit: params.limit };
      if (params.filter) requestParam.filter = JSON.stringify(params.filter);
      if (params.order) requestParam.order = JSON.stringify(params.order);
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/get_list_cms`,
        { params: requestParam }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching merchant list:', error);
      throw error;
    }
  };

  // 카테고리 필터 select 옵션 — 로딩 스피너를 띄우지 않는 axiosInstance(noloading)로 조회한다.
  getCategories = async (): Promise<ApiResponse<IMerchantCategoriesResult>> => {
    try {
      const response = await axios.axiosInstance.get(`/${tableName}/admin/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching merchant categories:', error);
      throw error;
    }
  };

  getDetail = async (id: string): Promise<ApiResponse<IMerchant>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/${id}`, {
        params: { fields: JSON.stringify(['$all']) },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching merchant detail:', error);
      throw error;
    }
  };

  create = async (payload: IMerchantCreatePayload): Promise<ApiResponse<IMerchant>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post(
        `/${tableName}/admin/create`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Error creating merchant:', error);
      throw error;
    }
  };

  update = async (id: string, payload: IMerchantUpdatePayload): Promise<ApiResponse<IMerchant>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.put(
        `/${tableName}/admin/${id}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Error updating merchant:', error);
      throw error;
    }
  };

  updateMulti = async (payload: IMerchantUpdateMultiPayload): Promise<ApiResponse<unknown>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.put(
        `/${tableName}/admin/update_multi`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Error bulk-updating merchants:', error);
      throw error;
    }
  };
}
