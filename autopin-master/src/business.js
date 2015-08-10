import Promise from 'bluebird';
import {MongoDB, RabbitMQ} from './shared/connection';


function isBalanceEnough(account) {
  let now = new Date();
  let currentBalance = account.totalBalance - account.usedBalance;
  return (now - account.startTime < currentBalance);
}

function charge(accountId, stopTime) {
  stopTime = stopTime || new Date();

  return Promise.using(MongoDB(), db  => {
    let collection = db.collection('accounts');
    return collection.findOneAsync({_id: accountId})
      .then(account => {
        if (!account) {
          throw `[!] Can't charge. Account not existed: ${accountId}`;
        } else {
          let chargeAmount = Math.min(account.totalBalance - account.usedBalance,
            stopTime - account.startTime);
          let modifyData = {
            $set: {
              state: 'DOWN',
              botKey: undefined,
              stopTime: stopTime
            },
            $inc: {
              usedBalance: chargeAmount
            }
          };

          return collection.updateAsync({_id: accountId}, modifyData)
            .then(() => console.log(`[!] Charged '${accountId}' for: ${chargeAmount}`));
        }
      });
  });
}

export default {
  isBalanceEnough,
  charge
}
