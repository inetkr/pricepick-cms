import BaseAPI from './base-api';

const table = 'policy';

export default class PolicyAPI extends BaseAPI {
  constructor() {
    super(table);
  }
}
