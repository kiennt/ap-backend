class BaseCustomError extends Error {
  constructor(argument) {
    Error.call(this);
    this.name = this.constructor.name;
    if (argument instanceof Error) {
      // Using argument as the base Error for extending
      this.message = argument.message;
      this.extendStackTrace(argument);
    } else {
      // Using argument as the Error message
      this.message = argument;
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

class HttpNetworkError extends BaseCustomError {
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
  HttpNetworkError: HttpNetworkError,
  HttpResponseError: HttpResponseError
};
