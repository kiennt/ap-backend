import _ from 'lodash';
import CryptoJS from 'crypto-js';
import utf8 from 'utf8';

import HttpClient from './http-client';


const CLIENT_ID = '1431602';
const CLIENT_SECRET = '492124fd20e80e0f678f7a03344875f9b6234e2b';
const URL = 'https://api.pinterest.com/v3/login/';

function sorted(data) {
  return _(data).pairs().sort().zipObject().value();
}

function generateSignature(method, url, data) {
  data = _.clone(data);
  data['client_id'] = CLIENT_ID;
  data = sorted(data);

  method = method.toUpperCase();
  url = encodeURIComponent(url);

  let query = _(data)
    .map((value, key) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  let message = `${method}&${url}&${query}`;
  /*eslint-disable*/
  let hash = CryptoJS.HmacSHA256(utf8.encode(message), CLIENT_SECRET);
  /*eslint-enable*/
  let signature = hash.toString(CryptoJS.enc.Hex);

  return signature;
}

function getAccessToken(email, password, httpHeaders) {
  let httpMethod = 'POST';
  let timestamp = new Date().getTime();
  let data = {
    'password': password,
    'timestamp': timestamp,
    'username_or_email': email
  };

  let signature = generateSignature(httpMethod, URL, data);
  let params = {
    'client_id': CLIENT_ID,
    'timestamp': timestamp,
    'oauth_signature': signature
  };
  data['client_id'] = CLIENT_ID;

  let httpClient = new HttpClient();
  return httpClient.request(httpMethod, URL, params, data, httpHeaders)
    .then(JSON.parse).get('data');
}

export default {
  generateSignature: generateSignature,
  getAccessToken: getAccessToken
};
