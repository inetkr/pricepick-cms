import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import { ApiResponse } from 'src/types/api_response';
import { IAdmin } from 'src/types/admin';

const tableName = 'employee';

export default class EmployeeAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  getMe = async (): Promise<ApiResponse<IAdmin>> => {
    const url = `/${tableName}/me`;
    try {
      const res = await axios.axiosInstanceWithLoading.get(url);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch:', error);
      throw error;
    }
  };
}
