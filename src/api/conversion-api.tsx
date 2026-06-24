import BaseAPI from './base-api';

const table = 'conversion';

export default class ConversionAPI extends BaseAPI {
  constructor() {
    super(table);
  }
}
