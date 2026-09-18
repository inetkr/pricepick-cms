import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type {
  IGifticonProductApiDetailRow,
  IGifticonProductApiRow,
} from 'src/types/gifticon-products/gifticon_product';
import type {
  IGifticonOrderApiRow,
  IGifticonOrderDateType,
  IGifticonOrderStatusFilter,
} from 'src/types/gifticons/gifticon_order';

export interface IGifticonOrderListParams {
  keyword?: string;
  product_name?: string;
  voucher_code?: string;
  status?: IGifticonOrderStatusFilter;
  date_type?: IGifticonOrderDateType;
  from?: string;
  to?: string;
}

export type IGifticonUnusedOrderListParams = Omit<IGifticonOrderListParams, 'status'>;

export interface IGifticonProductUpdatePayload {
  is_active?: boolean;
  image_url?: string;
  product_name?: string;
  description?: string;
}

export interface IGifticonProductUploadImageResult {
  image_path: string;
}

const tableName = 'gift';

export default class GiftAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  getProductList = async (
    page: number,
    limit: number,
    keyword?: string
  ): Promise<ApiPaginatedResponse<IGifticonProductApiRow>> => {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (keyword) params.keyword = keyword;
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/products`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching gifticon product list:', error);
      throw error;
    }
  };

  getProductDetail = async (id: string): Promise<ApiResponse<IGifticonProductApiDetailRow>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching gifticon product detail:', error);
      throw error;
    }
  };

  getOrderList = async (
    page: number,
    limit: number,
    filters?: IGifticonOrderListParams
  ): Promise<ApiPaginatedResponse<IGifticonOrderApiRow>> => {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params[key] = value;
        });
      }
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/orders`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching gifticon order list:', error);
      throw error;
    }
  };

  getUnusedOrderList = async (
    page: number,
    limit: number,
    filters?: IGifticonUnusedOrderListParams
  ): Promise<ApiPaginatedResponse<IGifticonOrderApiRow>> => {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params[key] = value;
        });
      }
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/orders/unused`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching unused gifticon order list:', error);
      throw error;
    }
  };

  getCancelledOrderList = async (
    page: number,
    limit: number,
    filters?: IGifticonUnusedOrderListParams
  ): Promise<ApiPaginatedResponse<IGifticonOrderApiRow>> => {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params[key] = value;
        });
      }
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/orders/cancelled`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching cancelled gifticon order list:', error);
      throw error;
    }
  };

  cancelOrder = async (id: string): Promise<ApiResponse<IGifticonOrderApiRow>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post(
        `/${tableName}/admin/orders/${id}/cancel`
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling gifticon order:', error);
      throw error;
    }
  };

  updateProduct = async (
    id: string,
    payload: IGifticonProductUpdatePayload
  ): Promise<ApiResponse<IGifticonProductApiRow>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.put(
        `/${tableName}/admin/products/${id}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Error updating gifticon product:', error);
      throw error;
    }
  };

  uploadProductImage = async (
    file: File
  ): Promise<ApiResponse<IGifticonProductUploadImageResult>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.axiosInstanceWithLoading.post(
        `/${tableName}/admin/products/upload_image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading gifticon product image:', error);
      throw error;
    }
  };
}
