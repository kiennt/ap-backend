"use strict";

var Bot = require("./bot").Bot;

var ACCESS_TOKEN = "MTQzMTU5NDo1MzcyNjU1Njc5NTQ5NDcxMjM6OTIyMzM3MjAzNjg1NDc3NTgwNzoxfDE0MjU4OTA3NjE6MC0tMDI2NTg5N2U2NzhjODUyYTlhMmY3MzhjZjVmMGY0MDE=";
var BOT_TYPE = "pinterest";

var bot = new Bot(ACCESS_TOKEN, BOT_TYPE);
console.log(bot.run());
