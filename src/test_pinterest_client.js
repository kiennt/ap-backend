import _ from 'lodash';
import Promise from 'bluebird';

import PinterestClient from './pinterest/client';
import Authentication from './lib/authentication';
import HttpHeaders from './config/http-headers';

import './exts/lodash';


export default class TestPinterestClient {
  constructor() {
    /*eslint-disable*/
    let accessToken = 'MTQzMTYwMjo1MzcyNjU1Njc5NTQ5NDcxMjM6OTIyMzM3MjAzNjg1NDc3NTgwNzoxfDE0MjcyNzk0Njc6MC0tMTlhNGFhMWFmZTJmNmIxODE1NjgzM2U5YjZjZDgwYjg=';
    /*eslint-enable*/
    let headers = HttpHeaders.randomHeaders();
    this.client = new PinterestClient(accessToken, headers);
  }

  run() {
    /*eslint-disable*/
    this.client
      .browseBoard('424816246039528614', 2, (boardDetail, pins, done) => {
        console.log(boardDetail);
        console.log(_(pins).map('id').value());
        console.log(pins[0]);
      });
    /*eslint-enable*/
  }
}
