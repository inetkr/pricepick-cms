import axios from 'src/utils/axios';
import BaseAPI from './base-api';

const table = 'transactionCouponHistory';

export default class TransactionCouponHistoryAPI extends BaseAPI {
  constructor() {
    super(table);
  }

  async cancelGifticon(id: string) {
    return axios.axiosInstanceWithLoading
      .post(`/admin/transactionCouponHistory/cancel/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to cancel gifticon:', error);
        throw error;
      });
  }
}
