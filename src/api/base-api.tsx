import axios from 'src/utils/axios';

export default class BaseAPI {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    const query = new URLSearchParams(params).toString();
    return `/${this.tableName}/admin/${endpoint}?${query}`;
  }

  filter<T>(params: Record<string, any>) {
    return axios.axiosInstanceWithLoading
      .get(this.buildUrl('get_list_cmns', params))
      .then((response) => response.data as T)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  getAllWithLoading<T>(page: number, pageSize: number) {
    const params = {
      page,
      pageSize,
    };

    return axios.axiosInstanceWithLoading
      .get(this.buildUrl('get_list_cmns', params))
      .then((response) => response.data as T)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  getAll<T>(page: number, pageSize: number) {
    const params = {
      page,
      pageSize,
    };

    return axios.axiosInstance
      .get(this.buildUrl('get_list_cmns', params))
      .then((response) => response.data as T)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  getById(id: string) {
    return axios.axiosInstance
      .get(`/${this.tableName}/admin/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch by ID:', error);
        throw error;
      });
  }

  add(body: any) {
    return axios.axiosInstanceWithLoading
      .post(`/${this.tableName}/admin`, body)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to add:', error);
        throw error;
      });
  }

  update(id: string, body: any) {
    return axios.axiosInstanceWithLoading
      .put(`/${this.tableName}/admin/update/${id}`, body)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to update:', error);
        throw error;
      });
  }

  delete(id: string) {
    return axios.axiosInstanceWithLoading
      .delete(`/${this.tableName}/admin/delete/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error('Failed to delete:', error);
        throw error;
      });
  }
}
