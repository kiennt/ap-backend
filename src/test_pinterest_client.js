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
      .openApp()
      .then((body) => {
        return body.bookmark;
      })
      .then((bookmark) => {
        this.client.browseMoreFeeds(bookmark, 2, (feeds, done) => {
          console.log(_(feeds).map('id').value());
          console.log(feeds[0]);
          done();
        });
      });
  }
}
