import BaseAPI from './base-api';

const table = 'exchangepolicy';

export default class ExchangePolicyAPI extends BaseAPI {
  constructor() {
    super(table);
  }
}
