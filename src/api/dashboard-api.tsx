import axios from 'src/utils/axios';

export default class DashboardAPI {
  async getTotalCount() {
    return axios.axiosInstance.get('/dashboard/get_total_count');
  }

  async getChart(start_at: number, end_at: number) {
    return axios.axiosInstance.get('/dashboard/get_chart', {
      params: { start_at, end_at },
    });
  }
}
