Promise.delay = function delay(timeout) {
  return function delayedPromise(...args) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(...args), timeout);
    });
  };
};
