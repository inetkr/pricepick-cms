import BaseAPI from './base-api';

const table = 'employee';

export default class EmployeeAPI extends BaseAPI {
  constructor() {
    super(table);
  }
}
