Promise.delay = function delay(time) {
  return (x) => new Promise((resolve, reject) => setTimeout(resolve, time, x));
};
