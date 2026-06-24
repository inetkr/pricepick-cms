import BaseAPI from './base-api';

const table = 'withdraw';

export default class WithdrawAPI extends BaseAPI {
  constructor() {
    super(table);
  }
}
