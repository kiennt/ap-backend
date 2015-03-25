import _ from 'lodash';


const DEFAULT_HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head'];

function getHandler(funcName, method) {
  return function (...args) {
    let requestFunc = this[funcName];
    return requestFunc.call(this, method.toUpperCase(), ...args);
  };
}

function CustomHttpHandlersMixin(funcName, httpMethods) {
  funcName = funcName || 'request';
  httpMethods = httpMethods || DEFAULT_HTTP_METHODS;

  return _(httpMethods)
    .map((method) => method.toLowerCase())
    .map((method) => [method, getHandler(funcName, method)])
    .zipObject()
    .value();
}

export default {
  HttpHandlersMixin: new CustomHttpHandlersMixin(),
  CustomHttpHandlersMixin: CustomHttpHandlersMixin
}
