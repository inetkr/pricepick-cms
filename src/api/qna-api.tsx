import axios from 'src/utils/axios';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { IQna, IQnaStats, IUpdateQnaPayload } from 'src/types/qna';

const tableName = 'qna';

export default class QnaAPI {
  getQnaList = async (
    page: number,
    limit: number,
    filter?: { state?: string; type?: string }
  ): Promise<ApiPaginatedResponse<IQna>> => {
    try {
      const requestParam: any = {
        page,
        limit,
        fields: JSON.stringify(['$all']),
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
      console.error('Failed to fetch qna list:', error);
      throw error;
    }
  };

  getQnaStats = async (): Promise<ApiResponse<IQnaStats>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/stats`);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch qna stats:', error);
      throw error;
    }
  };

  updateQna = async (id: string, body: IUpdateQnaPayload): Promise<ApiResponse<IQna>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.put(`/${tableName}/admin/update/${id}`, body);
      return res.data;
    } catch (error) {
      console.error('Failed to update qna:', error);
      throw error;
    }
  };

  // 삭제 엔드포인트는 다른 테이블과 달리 /admin 접두사 없이 /qna/:id 로 호출된다.
  deleteQna = async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.delete(`/${tableName}/${id}`);
      return res.data;
    } catch (error) {
      console.error('Failed to delete qna:', error);
      throw error;
    }
  };
}
