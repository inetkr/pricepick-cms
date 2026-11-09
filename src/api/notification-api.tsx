import axios from 'src/utils/axios';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type {
  INotification,
  INotificationAudienceCount,
  INotificationRecipientListResponse,
  INotificationTargetAudience,
  INotificationStat,
  ISendIndividualNotificationPayload,
  ISendIndividualNotificationResult,
  ISendNotificationPayload,
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

  // 발송 확인 팝업 — 고른 발송 대상의 수신 동의·미동의 인원 (팝업 안 표시라 전체 로딩은 띄우지 않는다)
  getAudienceCount = async (
    targetAudience: INotificationTargetAudience
  ): Promise<ApiResponse<INotificationAudienceCount>> => {
    try {
      const res = await axios.axiosInstance.get(`/${tableName}/admin/audience_count`, {
        params: { target_audience: targetAudience },
      });
      return res.data;
    } catch (error) {
      console.error('Failed to fetch push campaign audience count:', error);
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

  // 선택 개별 발송 — 일반 발송과 같은 주소에 target_audience: INDIVIDUAL로 보낸다.
  // (예전 send_test는 서버에서 막혀 있다)
  sendIndividualNotification = async (
    body: ISendIndividualNotificationPayload
  ): Promise<ApiResponse<ISendIndividualNotificationResult>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.post(`/${tableName}/admin/send`, body);
      return res.data;
    } catch (error) {
      console.error('Failed to send individual push campaign:', error);
      throw error;
    }
  };

  // 예약 건 취소 — 지우지 않고 CANCELLED로 남긴다. 발송 기록에 「예약 / 취소됨」으로 보이고 발송되지 않는다.
  cancelScheduledNotification = async (id: string): Promise<ApiResponse<INotification>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.post(`/${tableName}/admin/${id}/cancel`);
      return res.data;
    } catch (error) {
      console.error('Failed to cancel scheduled push campaign:', error);
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
