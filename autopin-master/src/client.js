import _ from 'lodash';
import Promise from 'bluebird';
import amqp from 'amqplib';
import uuid from 'node-uuid';

import {MongoDB, RabbitMQ} from './shared/connection';
import utils from './test-utils';
import business from './business';


function serialize(message) {
  return new Buffer(JSON.stringify(message));
}

function sendStartMessage(id) {
  return Promise.using(MongoDB(), RabbitMQ(), (db, {channel, connection}) => {
    let collection = db.collection('accounts');
    return collection.findOneAsync({_id: id})
      .tap(account => {
        // if (account) {
        //   if (account.state !== 'DOWN') {
        //     throw `[!] Cannot start account ${id}. State: ${account.state}`;
        //   }
        //   if (account.usedBalance >= account.totalBalance) {
        //     throw `[!] Not enough balance for account ${id}`;
        //   }
        // } else {
        //   throw `[!] Account not existed: ${id}`;
        // }
      })
      .then(account => {
        let botKey = uuid.v4();

        let content = serialize({
          action: 'start',
          data: {
            account: id,
            key: botKey
          }
        });
        channel.publish('start', '', content, {persistent: true});
        return collection.updateAsync({_id: id},
          {$set: {
            state: 'UP',
            botKey: botKey,
            startTime: new Date()
          }}).then(() => console.log('start'));
      })
  });
}

function sendStopMessage(id) {
  return Promise.using(MongoDB(), RabbitMQ(), (db, {channel, connection}) => {
    let collection = db.collection('accounts');
    return collection.findOneAsync({_id: id})
      .tap(account => {
        // if (account) {
        //   if (account.state !== 'UP') {
        //     throw `[!] Cannot stop account ${id}. State: ${account.state}`;
        //   }
        // } else {
        //   throw `[!] Account not existed: ${id}`;
        // }
      })
      .then(account => {
        let content = serialize({
          action: 'stop',
          data: {
            account: id,
            key: account.botKey
          }
        });
        channel.publish('stop', '', content, {persistent: true});
        return business.charge(id)
          .then(() => console.log('stop'));
      });
  });
}

Promise.resolve()
  .then(utils.refreshAllAccounts)
  .then(() => sendStartMessage(1))
  // .then(() => sendStopMessage(1))
  // .then(() => sendStartMessage(1)).then(() => sendStopMessage(1))
  // .then(() => sendStartMessage(1)).then(() => sendStopMessage(1))
  // .then(() => sendStartMessage(1)).then(() => sendStopMessage(1))
  // .then(() => sendStartMessage(1)).then(() => sendStopMessage(1))
  // .then(() => sendStartMessage(1)).then(() => sendStopMessage(1))
  // .then(() => sendStartMessage(1)).then(() => sendStopMessage(1))
  // .then(() => sendStartMessage(1)).then(() => sendStopMessage(1))
  // .then(() => sendStartMessage(1)).then(() => sendStopMessage(1))
  // .then(() => sendStartMessage(1)).then(() => sendStopMessage(1))
  // .then(() => sendStartMessage(1)).then(() => sendStopMessage(1))
  // .then(() => sendStartMessage(1)).then(() => sendStopMessage(1))

  // .then(() => sendStartMessage(2))
  // .then(() => sendStartMessage(1))
  // .then(() => sendStartMessage(2))
  // .then(() => sendStartMessage(1))
  // .then(() => sendStartMessage(2))

  // .then(() => sendStopMessage(1))
  // .then(() => sendStopMessage(2))
  .then(utils.allAccounts)
  .then(console.log);
