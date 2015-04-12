import _ from 'lodash';
import Promise from 'bluebird';

import PinterestApi from './api';


export default class PinterestClient {
  constructor(accessToken, httpHeaders) {
    this.api = new PinterestApi(accessToken, httpHeaders);
  }

  // Methods go here
}
