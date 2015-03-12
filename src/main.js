import { Bot } from './bot';
import './exts/promise';

/*eslint-disable*/
const ACCESS_TOKEN = 'MTQzMTU5NDo1MzcyNjU1Njc5NTQ5NDcxMjM6OTIyMzM3MjAzNjg1NDc3NTgwNzoxfDE0MjU4OTA3NjE6MC0tMDI2NTg5N2U2NzhjODUyYTlhMmY3MzhjZjVmMGY0MDE=';
/*eslint-disable*/
const BOT_TYPE = 'pinterest';

// let bot = new Bot(ACCESS_TOKEN, BOT_TYPE);
// bot.run();


// Demo code for Promise.delay
console.log('start');
Promise.resolve(1)
  .then(Promise.delay(1000))
  .then((x) => console.log(x))
  .then(() => Promise.resolve(2))
  .then(Promise.delay(2000))
  .then((x) => console.log(x))
  .then(() => console.log('end'));
