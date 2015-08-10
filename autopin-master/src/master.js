import _ from 'lodash';
import Promise from 'bluebird';
import PromiseQueue from 'promiseq';
import amqp from 'amqplib';

import {MongoDB, RabbitMQ, prepareChannel} from './shared/connection';
import utils from './test-utils';
import Config from './shared/config';
import BotCounter from './bot-counter';
import business from './business';


let BOTS = {};
let rabbit, counter, queue;

function main() {
  counter = new BotCounter();
  queue = new PromiseQueue(1);

  return prepareChannel(rabbit)
    .then((privateQueue) => {
      rabbit.consume('bot', messageHandler, {noAck: false});
      rabbit.consume(privateQueue, messageHandler, {noAck: false});
    });
}

function messageHandler(message) {
  let content = message.content.toString();
  let body = JSON.parse(message.content.toString());
  let data = body.data;

  console.log(content);

  switch (body.action) {
    case 'start':
      queue.push(handleStartMessage(message, data));
      break;
    case 'stop':
      queue.push(handleStopMessage(message, data));
      break;
    default:
      console.warn(`[!] Invalid message: ${content}.`);
  }
}

let Errors = {
  AccountNotFound: 0x0001,
  InvalidState: 0x0002,
  InvalidKey: 0x0003,
  NotEnoughBalance: 0x0004
};

function isCustomError(error) {
  let rejectErrors = [
    Errors.AccountNotFound, Errors.InvalidState, Errors.InvalidKey];
  if (error === Errors.NotEnoughBalance) {
    return -1;
  } else if (rejectErrors.indexOf(error) >= 0) {
    return 1;
  } else {
    return 0;
  }
}

function handleStartMessage(message, data) {
  let accountId = data.account;
  let key = data.key;

  return () => {
    counter.onIncoming();
    console.log('[!] Starting: ' + accountId);
    console.log('[*] ' + counter.log());

    if (counter.shouldAccept()) {
      let validator = Promise.using(MongoDB(), db => {
        console.log('Validating: ' + accountId);
        let collection = db.collection('accounts');
        return collection.findOneAsync({_id: accountId})
          .then(account => {
            check(account, key);
            console.log('Validated: ' + accountId);
            return account;
          });
      });

      return validator.then(
        (account) => {
          console.log('[!] Accept: ' + accountId);
          counter.onAccept();

          let oldBot = BOTS[accountId];
          if (oldBot) {
            _cancelBotTask(oldBot);
            rabbit.nack(oldBot.message, false, false);
            console.log(`[!] Cancelled '${accountId}' OLD task. Sent to hell.`);
            counter.onCancelOwnBot();
          }

          BOTS[accountId] = {
            task: undefined,
            message: message,
            key: key
          };

          loop(accountId, key, account);
        },
        (error) => {
          console.warn('[!] Error: ' + error);
          let isCustom = isCustomError(error);
          if (isCustom) {
            if (isCustom > 0) {
              console.warn(`[!] '${accountId}': Invalid state/key. Go to hell!.`);
              rabbit.nack(message, false, false);
            } else {
              console.warn(`[!] '${accountId}': Not enough balance. Charge...`);
              business.charge(accountId)
                .then(() => console.log(`[!] Successfully charged '${accountId}'`));
              rabbit.ack(message);
            }
          } else {
            rabbit.nack(message, false, true);  // Retry on other node
          }
          counter.onReject();
        }
      );
    } else {
      console.log('[!] Reject: ' + accountId);
      counter.onReject();
      rabbit.nack(message, false, true);
      return Promise.resolve();
    }
  };
}

function handleStopMessage(message, data) {
  let accountId = data.account;
  let key = data.key;

  return () => {
    console.log('[!] Stopping: ' + accountId);
    let bot = BOTS[accountId];
    if (bot) {
      if (key === bot.key) {
        _cancelBotTask(bot);
        rabbit.ack(bot.message);

        BOTS[accountId] = undefined;
        console.log(`[!] Cancelled '${accountId}' task.`);
        counter.onCancelOwnBot();
      } else {
        console.log(`[!] Invalid key for '${accountId}'. Not stop.`);
      }
    } else {
      console.log(`[!] '${accountId}' unown. Please go away.`)
      counter.onCancelUnownBot();
    }
    rabbit.ack(message);
    return Promise.resolve();
  };
}

function check(account, key) {
  if (!account) {
    throw Errors.AccountNotFound;
  }
  if (account.state !== 'UP') {
    throw Errors.InvalidState;
  }
  if (account.botKey !== key) {
    throw Errors.InvalidKey;
  }
  if (!business.isBalanceEnough(account)) {
    throw Errors.NotEnoughBalance;
  }
  return account;
}

function fetchAccount(accountId) {
  return Promise.using(MongoDB(), db => {
    let collection = db.collection('accounts');
    return collection.findOneAsync({_id: accountId});
  });
}

function loop(accountId, key, account) {
  // It prevents stack overflowing after running a long time
  let bot = BOTS[accountId];
  if (bot && bot.key === key) {
    let task;
    if (!account) {
      task = fetchAccount(accountId).tap(foundAcc => account = foundAcc);
    } else {
      task = Promise.resolve();
    }

    task = task
      .cancellable()
      .then(() => {
        console.log('Precheck: ' + accountId);
        return Promise.resolve(account)
          .then(acc => check(acc, key));
      })
      .then(() => runSession(account))
      .then(() => {
        console.log('Aftercheck: ' + accountId);
        return fetchAccount(accountId)
          .then(acc => check(acc, key));
      })
      .catch((error) => {
        let bot = BOTS[accountId];
        let isBotValid = bot && bot.key === key;
        let isCustom = isCustomError(error);

        if (isCustom) {
          if (isCustom > 0) {
            console.warn(`[!] '${accountId}': Invalid state/key. Canceling.`);
            if (isBotValid) {
              rabbit.nack(bot.message, false, false);
            }
          } else {
            console.warn(`[!] '${accountId}': Not enough balance :(. Charging.`);
            business.charge(accountId)
              .then(() => console.log(`[!] Successfully charged '${accountId}'`));
            if (isBotValid) {
              rabbit.ack(bot.message);
            }
          }
          BOTS[accountId] = undefined;
          counter.onCancelOwnBot();
          throw error;
        } else {
          console.warn(error);  // Resilient
        }
      })
      .then(() => setTimeout(loop, 5000, accountId, key))
      .catch((cancelReason) => {
        console.warn(`[!] '${accountId}' cancelled because of #${cancelReason}.`);
      });
    BOTS[accountId].task = task;
  }
}

function _cancelBotTask(bot) {
  let currentTask = bot.task || Promise.resolve();
  currentTask.cancel().then(null, null);
}

// TODO: Fill this with bot strategy
function runSession(account) {
  return Promise.resolve()
    .then(() => console.log('Start session: ' + account._id))
    .delay(5000)
    .then(() => console.log('End session: ' + account._id));
}

Promise.using(RabbitMQ(true), ({connection, channel}) => {

  let handleConnectionSignal = (error) => {
    if (error) {
      console.error(error);
      console.log('[!] RabbitMQ Connection errors. Process exits.');
    } else {
      console.log('[!] RabbitMQ Connection closes. Process exits.')
    }
    process.exit(1);
  }

  connection.on('error', handleConnectionSignal);
  connection.on('exit', handleConnectionSignal);

  console.log('[!] Connected');

  rabbit = channel;

  return main();
});

process.on('uncaughtException', console.error);
