import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import { ApiAuthResponse } from 'src/types/api_response';
import { IAdmin } from 'src/types/admin';

const tableName = 'auth';

export default class AuthAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  login = async (username: string, password: string): Promise<ApiAuthResponse<IAdmin>> => {
    const url = `/${tableName}/employee_login`;
    try {
      const res = await axios.axiosInstanceWithLoading.post<ApiAuthResponse<IAdmin>>(url, {
        username,
        password,
      });
      return res.data;
    } catch (error) {
      console.error('Failed to fetch:', error);
      throw error;
    }
  };

  logout = async (): Promise<ApiAuthResponse<{ status: boolean }>> => {
    const url = `/${tableName}/employee_logout`;
    try {
      const res =
        await axios.axiosInstanceWithLoading.post<ApiAuthResponse<{ status: boolean }>>(url);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch:', error);
      throw error;
    }
  };
}
