import axios from 'src/utils/axios';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type {
  INotification,
  INotificationRecipientListResponse,
  INotificationStat,
  ISendNotificationPayload,
  ISendTestNotificationPayload,
  ISendTestNotificationResult,
  IUserReceivedNotification,
} from 'src/types/notification';

const tableName = 'push_campaign';

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
    filter?: { title?: string; target_audience?: string; status?: string }
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

  sendNotification = async (
    body: ISendNotificationPayload
  ): Promise<ApiResponse<INotification>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.post(`/${tableName}/admin/send`, body);
      return res.data;
    } catch (error) {
      console.error('Failed to send push campaign:', error);
      throw error;
    }
  };

  // DEVQA 23 · 테스트 발송
  sendTestNotification = async (
    body: ISendTestNotificationPayload
  ): Promise<ApiResponse<ISendTestNotificationResult>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.post(`/${tableName}/admin/send_test`, body);
      return res.data;
    } catch (error) {
      console.error('Failed to send test push campaign:', error);
      throw error;
    }
  };

  // DEVQA 24 · 발송 건의 수신자 목록 (검색·페이징)
  getNotificationRecipients = async (
    id: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<INotificationRecipientListResponse> => {
    try {
      const requestParam: Record<string, string | number> = { page, limit };
      if (search) {
        requestParam.search = search;
      }
      const res = await axios.axiosInstance.get(`/${tableName}/admin/${id}/recipients`, {
        params: requestParam,
      });
      return res.data;
    } catch (error) {
      console.error('Failed to fetch notification recipients:', error);
      throw error;
    }
  };

  // 회원 상세의 「받은 알림」
  getUserReceivedNotifications = async (
    userId: string,
    limit: number = 20
  ): Promise<ApiPaginatedResponse<IUserReceivedNotification>> => {
    try {
      const res = await axios.axiosInstance.get(`/${tableName}/admin/user/${userId}/received`, {
        params: { page: 1, limit },
      });
      return res.data;
    } catch (error) {
      console.error('Failed to fetch received notifications:', error);
      throw error;
    }
  };
}
