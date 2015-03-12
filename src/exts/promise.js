function callback(context, ...args) {
  if (args.length === 0) {
    return context.resolve(undefined);
  }

  let error = args[0];
  if (error) {
    return context.reject(error);
  }

  let result = args.slice(1);
  switch (result.length) {
    case 0:
      return context.resolve(undefined);
    case 1:
      return context.resolve(result[0]);
    default:
      return context.resolve(result);
  }
}


// Usage: requestPromise = Promise.promisify(request.get)
Promise.promisify = function promisify(original) {
  return function promisified() {
    let args = Array.prototype.slice.call(arguments);
    return new Promise((resolve, reject) => {
      let context = {
        resolve: resolve,
        reject: reject
      };
      args.push(callback.bind(null, context));
      original.apply(original, args);
    });
  };
};


// Usage: promiseA.then(Promise.delayed(100)).then(...)
//        Promise.delayed(100)(5).then(...)
Promise.delayed = function delayed(time) {
  return (x) => new Promise((resolve, reject) => setTimeout(resolve, time, x));
};


// Usage: promiseA.delay(100).then(...)
Promise.prototype.delay = function delay(time) {
  return this.then(Promise.delayed(time));
};
