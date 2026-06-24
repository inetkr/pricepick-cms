import axios from 'src/utils/axios';

const table = 'statistics';

export default class StatisticsAPI {
  async getDailySalesStatistics(params: Record<string, any>) {
    return axios.axiosInstanceWithLoading
      .get(this.buildUrl(`daily-sales`, params))
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  async getMonthlySalesStatistics(params: Record<string, any>) {
    return axios.axiosInstanceWithLoading
      .get(this.buildUrl(`monthly-sales`, params))
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  async getConversionStatistics(params: Record<string, any>) {
    return axios.axiosInstanceWithLoading
      .get(this.buildUrl(`conversions`, params))
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    const query = new URLSearchParams(params).toString();
    return `/admin/statistics/${endpoint}?${query}`;
  }
}
