import axios from 'src/utils/axios';

export default class BaseAPI {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    const query = new URLSearchParams(params).toString();
    return `/admin/${this.tableName}${endpoint}?${query}`;
  }

  filter(params: Record<string, any>) {
    return axios.axiosInstanceWithLoading
      .get(this.buildUrl('/paged', params))
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  getAllWithLoading(page: number, pageSize: number) {
    const params = {
      page,
      pageSize,
    };

    return axios.axiosInstanceWithLoading
      .get(this.buildUrl('/paged', params))
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  getAll(page: number, pageSize: number) {
    const params = {
      page,
      pageSize,
    };

    return axios.axiosInstance
      .get(this.buildUrl('/paged'))
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  getById(id: string) {
    return axios.axiosInstance
      .get(`/admin/${this.tableName}/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch by ID:', error);
        throw error;
      });
  }

  add(body: any) {
    return axios.axiosInstanceWithLoading
      .post(`/admin/${this.tableName}`, body)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to add:', error);
        throw error;
      });
  }

  update(id: string, body: any) {
    return axios.axiosInstanceWithLoading
      .put(`/admin/${this.tableName}/${id}`, body)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to update:', error);
        throw error;
      });
  }

  delete(id: string) {
    return axios.axiosInstanceWithLoading
      .delete(`/admin/${this.tableName}/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error('Failed to delete:', error);
        throw error;
      });
  }
}
