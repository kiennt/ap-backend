function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomMaxRetry(minRetry, maxRetry) {
  return getRandomArbitrary(minRetry, maxRetry);
}

function getRandomDelay(min, max) {
  let randomNumber = getRandomArbitrary(min, max);
  return (randomNumber * 1000);
}

export default {
  randomMaxRetry: getRandomMaxRetry,
  randomDelay: getRandomDelay
};
