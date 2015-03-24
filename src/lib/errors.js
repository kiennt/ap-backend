class BaseCustomError extends Error {
  constructor(cause) {
    Error.call(this);
    this.name = this.constructor.name;
    if (cause instanceof Error) {
      // Using `cause` as the base Error for extending
      this.message = cause.message;
      this.extendStackTrace(cause);
    } else {
      // Using `cause` as the Error message
      this.message = cause;
      Error.captureStackTrace(this, this.constructor);
    }
  }

  extendStackTrace(baseError) {
    // Replacing the `XXXError:` string with this Error name
    let stack = baseError.stack;
    this.stack = this.constructor.name + stack.substring(stack.indexOf(':'));
  }
}

class HttpMethodError extends BaseCustomError {
  constructor(httpMethod) {
    super(`Unknown HTTP Method - ${httpMethod.toUpperCase()}`);
    this.method = httpMethod;
  }
}

// DISCUSS: Em đang suy nghĩ về cái tên này
// HttpNetworkError thì ko cover được hết các case như mình gửi sai cấu trúc
// VD: `options.uri is a required argument`
class HttpRequestError extends BaseCustomError {
  constructor(baseError) {
    super(baseError);
    this.cause = baseError;
  }
}

class HttpResponseError extends BaseCustomError {
  constructor(response, body) {
    super(`${response.statusCode} - ${response.statusMessage}`);
    this.response = response;
    this.body = body;
  }
}

export default {
  HttpMethodError: HttpMethodError,
  HttpRequestError: HttpRequestError,
  HttpResponseError: HttpResponseError
};
