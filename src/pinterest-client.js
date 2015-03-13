import HttpClient from './http-client'

const DOMAIN = 'https://api.pinterest.com/v3';

const HTTP_HEADERS = {
  'X-Pinterest-Device': 'GT-I9300',
  'X-Pinterest-AppState': 'background',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.1.2)'
};

function isValidOfContent(json) {
  let content = JSON.parse(json);
  if (content.code !== 0) {
    return false;
  }
  return true;
}

export default class PinterestClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.httpClient = new HttpClient();
  }

  request(httpMethod, relativePath, params={}, data={}) {
    data['access_token'] = this.accessToken;
    let absolutePath = `${DOMAIN}/${relativePath}`;
    return this.httpClient.request(
      httpMethod, absolutePath, params, data, HTTP_HEADERS);
  }

  commentAPin(pinId, text) {
    let data = {
      text: text
    };
    return this.request('POST', `pins/${pinId}/comment/`, {}, data)
      .then((body) => {
        return isValidOfContent(body);
      });
  }

  getInfoOfMe() {
    let fields = 'user.country,user.default_shipping(),user.default_payment()';
    let data = {
      'access_token': this.accessToken,
      'add_fields': fields
    };
    let promise = this.request('GET', `users/me/`, data, {});
    return promise.then((body) => {
      let content = JSON.parse(body);
      return content.data;
    });
  }

  likeAPin(pinId) {
    let promise = this.request('PUT', `pins/${pinId}/like/`, {}, {});
    return promise.then((body) => {
      return isValidOfContent(body);
    });
  }
}
