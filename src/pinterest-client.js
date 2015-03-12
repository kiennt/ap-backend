import HttpClient from './http-client'

const DOMAIN = 'https://api.pinterest.com/v3';

const HTTP_HEADERS = {
  'X-Pinterest-Device': 'GT-I9300',
  'X-Pinterest-AppState': 'background',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.1.2)'
};

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
        let content = JSON.parse(body);
        if (content.status !== 'success') {
          throw new Error('getInfoOfMe: ' + body.message);
        }
        return true;
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
      if (content.status !== 'success') {
        throw new Error('getInfoOfMe: ' + body.message);
      }

      this.clientId = content.data.id;

      return content.data;
    });
  }

  likeAPin(pinId) {
    // Ở đây em vẫn đẩy body ngược lên, best practice là ko catch error
    // để mình catch 1 thể ở Promise chain
    return this.request('PUT', `pins/${pinId}/like/`, {}, {});

    // Nếu ko định đẩy body lên mà đẩy 1 cái gì đấy thì làm như này:
    // (Lỗi vẫn để đẩy ngược lên trên)
    // return this.request('PUT', `pins/${pinId}/like/`, {}, {})
    //            .then((body) => JSON.parse(body)['field?']);
  }
}
