import Promise from './lib/promise';
import httpHeaders from './config/http-headers';
import { Bot } from './bot';

function checkBot() {
  /*eslint-disable*/
  const ACCESS_TOKEN = 'MTQzMTU5NDo1MzcyNjU1Njc5NTQ5NDcxMjM6OTIyMzM3MjAzNjg1NDc3NTgwNzoxfDE0MjU4OTA3NjE6MC0tMDI2NTg5N2U2NzhjODUyYTlhMmY3MzhjZjVmMGY0MDE=';
  /*eslint-disable*/
  const BOT_TYPE = 'pinterest';

  let headers = httpHeaders.randomHeaders();
  let bot = new Bot(ACCESS_TOKEN, headers, BOT_TYPE);
  bot.run();
}

function checkPromiseUntil() {
  let foo = 0;

  let inc = function(tag) {
    return new Promise((resolve, reject) => {
      console.log(tag + ' ' + foo);
      if (++foo == 10) {
        resolve('Yayyyyyyyyyyy');
      } else {
        reject(-1);
      }
    });
  };

  let retryConfig = {
    maxRetries: 5,
    delay: 1000,
    incrementalFactor: 0.5,
    willRetry: (error) => (typeof error === 'number')
  };
  Promise.resolve('Hello')
    .then((x) => Promise.tryUntil(retryConfig, inc, x))
    .then((x) => console.log('!!! ' + x))
    .catch((err) => console.log('*** Error: ' + err));
}

checkPromiseUntil();
