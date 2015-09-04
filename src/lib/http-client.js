import _ from 'lodash';
import Promise from 'bluebird';
import request from 'request';

import Errors from './errors';
import {HttpHandlersMixin} from '../mixins/http-handlers';

import '../exts/promise';


const HTTP_HANDLERS = _.mapValues({
  GET: request.get,
  POST: request.post,
  PUT: request.put,
  PATCH: request.patch,
  DELETE: request.del,
  HEAD: request.head
}, (handler) => Promise.promisify(handler, request));

const DEFAULT_RETRY_CONFIGURATION = {
  maxRetries: 5,
  delay: 1000,
  incrementalFactor: 2,  // 1 -> 2 -> 4 -> 8 -> 16
  willRetry: (error) => (error instanceof Errors.HttpRequestError)
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
    let query = _(params)
      .map((value, key) => `${key}=${value}`)
      .join('&');
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
      return Promise.reject(
        new Errors.HttpError(`Unknown HTTP Method - ${httpMethod}`));
    }

    let requestBody = {
      url: this.getFullURL(absolutePath, params),
      form: data,
      headers: headers
    };

    let singleRequest = () => {
      return handler(requestBody)
        .spread((response, body) => {
          let statusCode = response.statusCode;
          if (isStatusCodeValid(statusCode)) {
            return body;
          } else {
            console.error(response);
            throw new Errors.HttpResponseError(response, body);
          }
        }, (error) => {
          console.error(error);
          throw new Errors.HttpRequestError(error);
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

_.extend(HttpClient.prototype, HttpHandlersMixin);
