import {BaseCustomError} from './base'

class HttpError extends BaseCustomError {
}

class HttpRequestError extends HttpError {
  constructor(baseError) {
    super(baseError);
    this.cause = baseError;
  }
}

class HttpResponseError extends HttpError {
  constructor(response, body) {
    let statusString = `${response.statusCode}`;
    if (response.statusMessage) {
      statusString += ` - ${response.statusMessage}`;
    }

    super(statusString);
    this.response = response;
    this.body = body;
  }
}

export default {
  HttpError: HttpError,
  HttpRequestError: HttpRequestError,
  HttpResponseError: HttpResponseError
};
