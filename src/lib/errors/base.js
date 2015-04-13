import _ from 'lodash';


export class BaseCustomError extends Error {
  constructor(cause, errorName) {
    Error.call(this);
    this.name = errorName || this.constructor.name;
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
    this.stack = this.name + stack.substring(stack.indexOf(':'));
  }
}

export function customError(errorName) {
  class NewCustomError extends BaseCustomError {
    constructor(cause, details) {
      super(cause, errorName);
      _.forOwn(details, (value, key) => this[key] = value);
    }
  }
  return NewCustomError;
}
