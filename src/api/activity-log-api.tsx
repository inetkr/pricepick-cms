import axios from 'src/utils/axios';
import type { ApiPaginatedResponse } from 'src/types/api_response';
import type { IActivityLog } from 'src/types/activity_log';

const tableName = 'activity_log';

export default class ActivityLogAPI {
  getActivityLogList = async (
    page: number,
    limit: number,
    filter?: { employee_id?: string; action?: string }
  ): Promise<ApiPaginatedResponse<IActivityLog>> => {
    try {
      const requestParam: any = {
        page,
        limit,
        order: JSON.stringify([['created_at', 'desc']]),
        fields: JSON.stringify(['$all']),
      };
      if (filter) {
        requestParam.filter = JSON.stringify(filter);
      }
      const res = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/get_list_cms`, {
        params: requestParam,
      });
      return res.data;
    } catch (error) {
      console.error('Failed to fetch activity log list:', error);
      throw error;
    }
  };
}
