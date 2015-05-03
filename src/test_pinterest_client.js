import _ from 'lodash';
import Promise from 'bluebird';

import PinterestClient from './pinterest/client';
import Authentication from './lib/authentication';
import HttpHeaders from './config/http-headers';

import './exts/lodash';

const CATEGORY = process.argv.slice(2)[0];


export default class TestPinterestClient {
  constructor() {
    /*eslint-disable*/
    let accessToken = 'MTQzMTU5NDo1MzcyNjU1Njc5NTQ5NDcxMjM6OTIyMzM3MjAzNjg1NDc3NTgwNzoxfDE0MjU4OTA3NjE6MC0tMDI2NTg5N2U2NzhjODUyYTlhMmY3MzhjZjVmMGY0MDE=';
    /*eslint-enable*/
    let headers = HttpHeaders.randomHeaders();
    this.client = new PinterestClient(accessToken, headers);
  }

  run() {
    /*eslint-disable*/
    this.client
      .openApp()
      .then((data) => {
        this.client
          .browseCategoryFeeds(CATEGORY, 100, (feeds, done) => {
            feeds.forEach((feed) => {
              let data = {
                id: feed.id,
                text: feed.description
              };
              console.log(JSON.stringify(data), ',');
            });
          });
      });
  }
}
