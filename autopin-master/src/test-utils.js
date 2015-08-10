import _ from 'lodash';
import Promise from 'bluebird';

import {MongoDB, RabbitMQ} from './shared/connection';


function preloadAccount(id, totalBalance, usedBalance) {
  console.log(`[!] Preload account: ${id}`)
  totalBalance = totalBalance || 3600;
  usedBalance = usedBalance || 0;

  return Promise.using(MongoDB(), db => {
    let collection = db.collection('accounts');
    return collection.findOneAsync({_id: id})
      .then(existedAccount => {
        if (!existedAccount) {
          return collection.insertAsync({
              _id: id,
              totalBalance: totalBalance,
              usedBalance: usedBalance,
              state: 'DOWN',
              startTime: undefined,
              stopTime: undefined,
              botKey: undefined
            })
            .then(result => result.ops[0]);
        } else {
          return existedAccount;
        }
      });
  });
}

function updateAccount(id, data) {
  return Promise.using(MongoDB(), db => {
    let collection = db.collection('accounts');
    return collection.updateAsync({_id: id}, {$set: data});
  });
}

function allAccounts() {
  return Promise.using(MongoDB(), db => {
    let collection = db.collection('accounts');
    return collection.find({}).toArrayAsync();
  });
}

function refreshAllAccounts() {
  return Promise.using(MongoDB(), db => {
    let collection = db.collection('accounts');
    return collection.updateAsync({}, {$set: {
      state: 'DOWN',
      totalBalance: 20000,
      usedBalance: 0
    }}, {multi: true});
  });
}

export default {
  preloadAccount,
  updateAccount,
  allAccounts,
  refreshAllAccounts
}
