import Promise from './lib/promise';
import httpHeaders from './config/http-headers';
import { Bot } from './bot';

/*eslint-disable*/
const ACCESS_TOKEN = 'MTQzMTU5NDo1MzcyNjU1Njc5NTQ5NDcxMjM6OTIyMzM3MjAzNjg1NDc3NTgwNzoxfDE0MjU4OTA3NjE6MC0tMDI2NTg5N2U2NzhjODUyYTlhMmY3MzhjZjVmMGY0MDE=';
/*eslint-disable*/
const BOT_TYPE = 'pinterest';
let headers = httpHeaders.randomHeaders();
let bot = new Bot(ACCESS_TOKEN, headers, BOT_TYPE);
bot.run();
