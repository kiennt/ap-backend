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
      .getUserPins('383932074391788460', 1, 'LT4zODM5MzE5MzY5NjAzOTk3Mzk6MToxfDY3NGEzYjA5OGEzY2E1YWE2YjYwZjAzYWU4ZjhkOWNkMDYyM2UxYzE1NTdjMDJjOGJmZmM4NGIyZWQ3ZThhNDU=')
      .then((data) => {
        console.log(data);
      });
    /*eslint-enable*/
  }
}
