import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { IAdmin, ICreateEmployeePayload, IUpdateEmployeePayload } from 'src/types/admin';
import md5 from 'md5';

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

  getEmployeeList = async (): Promise<ApiPaginatedResponse<IAdmin>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/get_list_cms?fields=["$all"]`
      );
      return res.data;
    } catch (error) {
      console.error('Failed to fetch employee list:', error);
      throw error;
    }
  };

  createEmployee = async (body: ICreateEmployeePayload): Promise<ApiResponse<IAdmin>> => {
    try {
      const payload = {
        ...body,
        password: md5(body.password), // Assuming you want to hash the password before sending it
      };

      const res = await axios.axiosInstanceWithLoading.post(`/${tableName}`, payload);
      return res.data;
    } catch (error) {
      console.error('Failed to create employee:', error);
      throw error;
    }
  };

  updateEmployee = async (
    id: string,
    body: IUpdateEmployeePayload
  ): Promise<ApiResponse<IAdmin>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.put(
        `/${tableName}/admin/update/${id}`,
        body
      );
      return res.data;
    } catch (error) {
      console.error('Failed to update employee:', error);
      throw error;
    }
  };

  deleteEmployee = async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await axios.axiosInstanceWithLoading.delete(`/${tableName}/${id}`);
      return res.data;
    } catch (error) {
      console.error('Failed to delete employee:', error);
      throw error;
    }
  };
}
