import _ from 'lodash';
import Promise from 'bluebird';

import PinterestClient from './pinterest/client';
import Authentication from './lib/authentication';
import HttpHeaders from './config/http-headers';

import './exts/lodash';


export default class TestPinterestClient {
  constructor() {
    /*eslint-disable*/
    let accessToken = 'MTQzMTU5NDo1MzcyNjU1Njc5NTQ5NDcxMjM6OTIyMzM3MjAzNjg1NDc3NTgwNzoxfDE0MzEwMTA4NzA6MC0tM2RjZWI2MmZiZjgwODkxY2M3OWE0M2Y2M2FkZGFmMDI=';
    /*eslint-enable*/
    let headers = HttpHeaders.randomHeaders();
    this.client = new PinterestClient(accessToken, headers);
  }

  run() {
    /*eslint-disable*/
    this.client
      .openApp()
      .then(console.log, console.error);
  }
}
