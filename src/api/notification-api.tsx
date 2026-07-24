import axios from 'src/utils/axios';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { INotification, INotificationStat, ISendNotificationPayload } from 'src/types/notification';

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

  sendNotification = async (body: ISendNotificationPayload): Promise<ApiResponse<INotification>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.post(`/${tableName}/admin/send`, body);
      return res.data;
    } catch (error) {
      console.error('Failed to send push campaign:', error);
      throw error;
    }
  };
}
