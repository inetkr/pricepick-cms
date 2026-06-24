import axios, { endpoints, fetcher } from 'src/utils/axios';
import { convertParams } from 'src/utils/helper';
import BaseAPI from './base-api';

const tableName = 'user';
export default class UserAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  getUserProfile = async (userId: string) => {
    const url = `/admin/user/profile/${userId}`;
    try {
      const res = await axios.axiosInstance.get(url);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch:', error);
      throw error;
    }
  };

  updateUserInfo = async (
    userId: string,
    data: {
      status?: number;
      adminNote?: string;
    }
  ) => {
    const url = `/admin/user/update-info/${userId}`;
    try {
      const res = await axios.axiosInstance.patch(url, data);
      return res.data;
    } catch (error) {
      console.error('Failed to update user info:', error);
      throw error;
    }
  };

  getUserUninstallAppHistory = async (params: Record<string, any>) => {
    const query = new URLSearchParams(params).toString();
    const url = `/admin/user/user-uninstall-history?${query}`;
    return axios.axiosInstanceWithLoading
      .get(url)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  };
}
