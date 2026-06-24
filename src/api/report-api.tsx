import axios from 'src/utils/axios';

export default class ReportAPI {
  async filter(params: Record<string, any>) {
    return axios.axiosInstanceWithLoading
      .get(this.buildUrl('paged', params))
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  async processReport(reportId: string) {
    return axios.axiosInstanceWithLoading
      .post(`/admin/report/process/${reportId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to process report:', error);
        throw error;
      });
  }

  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    const query = new URLSearchParams(params).toString();
    return `/admin/report/${endpoint}?${query}`;
  }
}
