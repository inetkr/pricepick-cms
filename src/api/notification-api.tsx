import axios from 'src/utils/axios';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type {
  ICreateNotificationPayload,
  INotification,
  INotificationStat,
  ISendTestNotificationPayload,
} from 'src/types/notification';

const tableName = 'notification';

export default class NotificationAPI {
  getNotificationStats = async (): Promise<ApiResponse<INotificationStat>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/stats`);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch notification stats:', error);
      throw error;
    }
  };

  getNotificationList = async (
    page: number,
    limit: number,
    filter?: { title?: string; channel?: string; target?: string; status?: string }
  ): Promise<ApiPaginatedResponse<INotification>> => {
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
      console.error('Failed to fetch notification list:', error);
      throw error;
    }
  };

  createNotification = async (
    body: ICreateNotificationPayload
  ): Promise<ApiResponse<INotification>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.post(`/${tableName}/admin/create`, body);
      return res.data;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  };

  sendTestNotification = async (
    body: ISendTestNotificationPayload
  ): Promise<ApiResponse<any>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.post(`/${tableName}/admin/test`, body);
      return res.data;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  };

  // 예약 발송 취소. announcement와 동일하게 /admin 접두사 없이 /notification/:id 로 호출된다.
  cancelNotification = async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.delete(`/${tableName}/${id}`);
      return res.data;
    } catch (error) {
      console.error('Failed to cancel notification:', error);
      throw error;
    }
  };
}
