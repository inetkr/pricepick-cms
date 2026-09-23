import axios from 'src/utils/axios';
import type { ApiResponse } from 'src/types/api_response';
import type {
  IMerchant,
  IMerchantCategoriesResult,
  IMerchantDetail,
  IMerchantCreatePayload,
  IMerchantListResult,
  IMerchantSyncResult,
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

  // 제휴몰 정보 모달이 쓰는 조회 — 목록에 없는 링크프라이스 원문(raw_detail)까지 받아온다.
  // 모달을 열 때마다 한 건씩만 부르므로 전역 로딩 스피너를 띄우지 않는 instance를 쓴다.
  getDetail = async (id: string): Promise<ApiResponse<IMerchantDetail>> => {
    try {
      const response = await axios.axiosInstance.get(`/${tableName}/admin/${id}`, {
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

  // 링크프라이스 광고주 조회 API를 지금 불러와 merchant_source=LINKPRICE 레코드(수수료율·
  // 링크프라이스 승인 상태 등)를 갱신한다. 호출부(useTicketAccrual)가 성공 후 카탈로그
  // 목록을 다시 조회해 화면에 반영한다.
  syncLinkprice = async (): Promise<ApiResponse<IMerchantSyncResult>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post(
        `/${tableName}/admin/sync_linkprice`
      );
      return response.data;
    } catch (error) {
      console.error('Error syncing linkprice merchants:', error);
      throw error;
    }
  };
}
