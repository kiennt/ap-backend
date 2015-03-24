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
    super(`${response.statusCode} - ${response.statusMessage}`);
    this.response = response;
    this.body = body;
  }
}

export default {
  HttpError: HttpError,
  HttpRequestError: HttpRequestError,
  HttpResponseError: HttpResponseError
};
