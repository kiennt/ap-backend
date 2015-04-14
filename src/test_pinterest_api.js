import _ from 'lodash';
import Promise from 'bluebird';

import PinterestApi from './pinterest/api';
import Authentication from './lib/authentication';
import HttpHeaders from './config/http-headers';

import './exts/lodash';


export default class TestPinterestApi {
  constructor() {
    /*eslint-disable*/
    let accessToken = 'MTQzMTYwMjo0MjQ4MTYzMTQ3NTkwMTAwMjk6OTIyMzM3MjAzNjg1NDc3NTgwNzoxfDE0Mjg4MjI1ODE6MC0tODIxZmVjYzg2NWNlYThmMmNmYzE0YWIzNTIwMGFlMTU=';
    /*eslint-enable*/
    let headers = HttpHeaders.randomHeaders();
    this.api = new PinterestApi(accessToken, headers);
  }

  run() {
    /*eslint-disable*/
    this.api
      .getUserFollowing('383932074391788460', 1, 'Pz8xNjYwODk4OTYuNDAyXy0xfDI5NmM3NWFlMDIyOGM5YTQ3NjY3ZDIxMTg4OGI1MWY0YWI3NDk2YzFkYWJmMDhiNTJiM2ZlYjY0YTM3MDNmNzc=')
      .then((data) => {
        console.log(data);
      });
    /*eslint-enable*/
  }
}
