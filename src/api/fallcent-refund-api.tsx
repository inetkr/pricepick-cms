import axios from 'src/utils/axios';
import BaseAPI from './base-api';

const table = 'fallcentrefund';

export default class FallcentRefundAPI extends BaseAPI {
  constructor() {
    super(table);
  }

  refundFallcentKey = async (payload: {
    user_id: string;
    point: number;
    exchange_rate: number;
  }) => {
    return axios.axiosInstanceWithLoading
      .post(`/admin/${table}/refund`, payload)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  };
}
