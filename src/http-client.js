import request from 'request';
import Promise from './lib/promise';

const HTTP_HANDLERS = {
  GET: request.get,
  POST: request.post,
  PUT: request.put,
  DELETE: request.delete
};

function isStatusCodeValid(statusCode) {
  let is2xx = (statusCode >= 200) && (statusCode <= 299);
  let is3xx = (statusCode >= 300) && (statusCode <= 399);
  return is2xx || is3xx;
}

export default class HttpClient {
  constructor() {
  }

  getFullURL(absolutePath, params) {
    let query = Object.keys(params).map(x => `${x}=${params[x]}`).join('&');
    if (query) {
      return `${absolutePath}?${query}`;
    } else {
      return absolutePath;
    }
  }

  request(httpMethod, absolutePath, params={}, data={}, headers={}) {
    httpMethod = (httpMethod || '').toUpperCase();
    let handler = HTTP_HANDLERS[httpMethod];
    if (!handler) {
      return Promise.reject(new Error(`Unknown HTTP method: ${httpMethod}`));
    }

    let requestBody = {
      url: this.getFullURL(absolutePath, params),
      formData: data,
      headers: headers
    };

    var promisifiedHandler = Promise.promisify(handler);
    return promisifiedHandler(requestBody).then((result) => {
      let [response, body] = result;
      let statusCode = response.statusCode;
      if (isStatusCodeValid(statusCode)) {
        return body;
      } else {
        throw new new Error(`HTTP Status: ${statusCode}`);
      }
    });
  }
}
