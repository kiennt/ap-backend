// Usage: promiseA.then(Promise.delayed(100)).then(...)
//        Promise.delayed(100)(5).then(...)
Promise.delayed = function delayed(time) {
  return (x) => new Promise((resolve, reject) => setTimeout(resolve, time, x));
};

// Usage: promiseA.delay(100).then(...)
Promise.prototype.delay = function delay(time) {
  return this.then(Promise.delayed(time));
};
