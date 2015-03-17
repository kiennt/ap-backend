/* global HttpClient */

import request from 'request';
import Promise from './lib/promise';

const HTTP_HANDLERS = {
  GET: request.get,
  POST: request.post,
  PUT: request.put,
  DELETE: request.delete
};

const DEFAULT_RETRY_CONFIGURATION = {
  maxRetries: 5,
  delay: 1000,
  incrementalFactor: 2,  // 1 -> 2 -> 4 -> 8 -> 16
  willRetry: (error) => {
    // TODO: We will update this function when we have custom error classes
    return true;  // always retry
  }
};

function isStatusCodeValid(statusCode) {
  let is2xx = (statusCode >= 200) && (statusCode <= 299);
  let is3xx = (statusCode >= 300) && (statusCode <= 399);
  return is2xx || is3xx;
}

export default class HttpClient {
  constructor() {
  }

  static disableAutoRetry() {
    this.isAutoRetryDisabled = true;
  }

  static enableAutoRetry() {
    this.isAutoRetryDisabled = false;
  }

  static setRetryConfiguration(retryConfiguration) {
    this.retryConfiguration = retryConfiguration;
  }

  static getRetryConfiguration() {
    return this.retryConfiguration || DEFAULT_RETRY_CONFIGURATION;
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
      form: data,
      headers: headers
    };

    let promisifiedHandler = Promise.promisify(handler);
    let singleRequest = () => {
      return promisifiedHandler(requestBody).spread((response, body) => {
        let statusCode = response.statusCode;
        if (isStatusCodeValid(statusCode)) {
          return body;
        } else {
          throw new Error(`HTTP Status: ${statusCode}`);
        }
      });
    };

    if (HttpClient.isAutoRetryDisabled) {
      return singleRequest();
    } else {
      let retryConfiguration = HttpClient.getRetryConfiguration();
      return Promise.tryUntil(retryConfiguration, singleRequest);
    }
  }
}
