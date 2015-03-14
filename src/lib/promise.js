export * from 'bluebird';

import Promise from 'bluebird';

function attempt(config, promiseFunc, funcArgs) {
  let catcher = (err) => {
    if (config.maxRetries === undefined || config.maxRetries > 0) {
      if (config.maxRetries) {
        config.maxRetries = config.maxRetries - 1;
      }
      if (config.delay) {
        let thisRetryDelay = config.delay;
        config.delay = Math.round(thisRetryDelay * config.incrementalFactor);
        return Promise.delay(thisRetryDelay)
          .then(() => attempt(config, promiseFunc, funcArgs));
      } else {
        return attempt(config, promiseFunc, funcArgs);
      }
    } else {
      return Promise.reject(err);
    }
  };
  return promiseFunc(...funcArgs).catch(catcher);
}

// Example:
//    let retryConfig = {maxRetries: 5, delay: 1000};
//    promiseA.then((x) => Promise.until(retryConfig, asyncFunc, x)).then(...)
//    ! asyncFunc(x) returns a promise (or a "promise chain" with `.then`)
// Usage:
//    Promise.until(promiseFunc, funcArgs)
//    Promise.until(config, promiseFunc, funcArgs)
// Parameters:
//  - config: (default = {maxRetries: undefined, delay: 0})
//    + maxRetries: (default = undefined) maximum number of retries, can be:
//      * a number (0 means no retry)
//      * undefined: unlimited retries
//    + delay: (default = 0) base delay time between each retries
//    + incrementalFactor: (default = 1)
//      * == 1: the delay times between each retries are the same
//      * > 1: the delay times are multiplied, for example (1 -> 2 -> 4 -> ...)
//  - promiseFunc: a function that returns a promise
//  - funcArgs: the arguments that would be passed to the `promiseFunc`

Promise.until = function until(...args) {
  let config, promiseFunc, funcArgs;
  if (typeof args[0] === 'function') {
    config = {};
    promiseFunc = args[0];
    funcArgs = args.slice(1);
  } else {
    config = args[0];
    promiseFunc = args[1];
    funcArgs = args.slice(2);
  }

  // Normalized config
  config.delay = config.delay || 0;
  config.incrementalFactor = config.incrementalFactor || 1;

  return attempt(config, promiseFunc, funcArgs);
};
