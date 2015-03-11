import request from 'request';

const HTTP_HANDLERS = {
  GET: request.get,
  POST: request.post,
  PUT: request.put,
  DELETE: request.delete
};

let isStatusCodeValid = function (statusCode) {
  let is2xx = (statusCode >= 200) && (statusCode <= 299);
  let is3xx = (statusCode >= 300) && (statusCode <= 300);
  return is2xx || is3xx;
};

export default class HttpClient {
  constructor() {
  }

  getFullURL(absolutePath, params) {
    let query = Object.keys(params).map(x => `${x}=${params[x]}`).join('&');
    return `${absolutePath}?${query}`;
  }

  request(httpMethod, absolutePath, params={}, data={}, headers={}) {
    httpMethod = (httpMethod || '').toUpperCase();
    let handler = HTTP_HANDLERS[httpMethod];
    let fullUrl = this.getFullURL(absolutePath, params);
    let requestBody = {
      url: fullUrl,
      formData: data
    };

    if (!handler)
      return Promise.reject(new Error(`Unknown HTTP method: ${httpMethod}`));

    return new Promise((resolve, reject) => {
      handler(requestBody, (err, response, body) => {
        if (err) return reject(err);

        let statusCode = response.statusCode;
        if (isStatusCodeValid(statusCode)) resolve(body);
        else reject(new Error(`HTTP Status: ${statusCode}`));
      });
    });
  }
}
