import axios from 'src/utils/axios';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type {
  IAnnouncement,
  IAnnouncementStat,
  ICreateAnnouncementPayload,
  IUpdateAnnouncementPayload,
} from 'src/types/announcement';

const tableName = 'announcement';

export default class AnnouncementAPI {
  getAnnouncementStats = async (): Promise<ApiResponse<IAnnouncementStat>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/stats`);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch announcement stats:', error);
      throw error;
    }
  };

  getAnnouncementList = async (
    page: number,
    limit: number,
    filter?: { title?: string; type?: string }
  ): Promise<ApiPaginatedResponse<IAnnouncement>> => {
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
      console.error('Failed to fetch announcement list:', error);
      throw error;
    }
  };

  createAnnouncement = async (
    body: ICreateAnnouncementPayload
  ): Promise<ApiResponse<IAnnouncement>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.post(`/${tableName}/admin/create`, body);
      return res.data;
    } catch (error) {
      console.error('Failed to create announcement:', error);
      throw error;
    }
  };

  // 수정/삭제 엔드포인트는 다른 테이블과 달리 /admin 접두사 없이 /announcement/:id 로 호출된다.
  updateAnnouncement = async (
    id: string,
    body: IUpdateAnnouncementPayload
  ): Promise<ApiResponse<IAnnouncement>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.put(`/${tableName}/${id}`, body);
      return res.data;
    } catch (error) {
      console.error('Failed to update announcement:', error);
      throw error;
    }
  };

  deleteAnnouncement = async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.delete(`/${tableName}/${id}`);
      return res.data;
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      throw error;
    }
  };
}
