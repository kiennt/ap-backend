import Promise from 'bluebird';

function attempt(config, promiseFunc, funcArgs) {
  let catcher = (error) => {
    let shouldRetry = config.willRetry(error);
    let anyRetriesLeft = (config.maxRetries === undefined ||
                          config.maxRetries > 0);
    if (shouldRetry && anyRetriesLeft) {
      // console.log('Retries left: ' + config.maxRetries);
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
      return Promise.reject(error);
    }
  };
  return promiseFunc(...funcArgs).catch(catcher);
}

// Example:
//    let config = {maxRetries: 5, delay: 1000};
//    promiseA.then((x) => Promise.tryUntil(config, asyncFunc, x)).then(...)
//    ! asyncFunc(x) returns a promise (or a "promise chain" with `.then`)
// Usage:
//    Promise.tryUntil(promiseFunc, funcArgs)
//    Promise.tryUntil(config, promiseFunc, funcArgs)
// Parameters:
//  - config: (default = {maxRetries: undefined, delay: 0})
//    + maxRetries: (default = undefined) maximum number of retries, can be:
//      * a number (0 means no retry)
//      * undefined: unlimited retries
//    + delay: (default = 0) base delay time between each retries
//    + incrementalFactor: (default = 1)
//      * == 1: the delay times between each retries are the same
//      * > 1: the delay times are multiplied, for example (1 -> 2 -> 4 -> ...)
//    + willRetry: (default = undefined - always retry) `(error) => true/false`
//  - promiseFunc: a function that returns a promise
//  - funcArgs: the arguments that would be passed to the `promiseFunc`

Promise.tryUntil = function tryUntil(...args) {
  let userConfig, promiseFunc, funcArgs;
  if (typeof args[0] === 'function') {
    userConfig = {};
    promiseFunc = args[0];
    funcArgs = args.slice(1);
  } else {
    userConfig = args[0];
    promiseFunc = args[1];
    funcArgs = args.slice(2);
  }

  // Normalize config
  let defaultWillRetry = (error) => true;  // Linter is too dumb
  let normalizedConfig = {
    maxRetries: userConfig.maxRetries,
    delay: userConfig.delay || 0,
    incrementalFactor: userConfig.incrementalFactor || 1,
    willRetry: userConfig.willRetry || (error) => true
  };

  return attempt(normalizedConfig, promiseFunc, funcArgs);
};
