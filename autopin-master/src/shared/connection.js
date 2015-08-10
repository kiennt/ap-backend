import util from 'util';

import _ from 'lodash';
import Promise from 'bluebird';
import amqp from 'amqplib';
import mongo from './promisified-mongo';

import Config from './config';

import '../exts/promise';


const RABBITMQ_RETRY_CONFIG = {
  maxRetries: 2,
  delay: 1000,
  incrementalFactor: 2,
  messageFormatter: (retryDelay => {
    let message = '[!] Cannot connect to RabbitMQ. Retry in [%s] seconds';
    return util.format(message, retryDelay / 1000);
  })
};

function MongoDB() {
  return mongo.MongoClient.connectAsync(Config.MONGODB_URL)
    .disposer(db => db.close());
}

function _connectRabbitMQ(url) {
  let getConnection = amqp.connect(url);
  let getChannel = getConnection
    .then(connection => connection.createChannel());
  return Promise.join(getConnection, getChannel,
    (connection, channel) => ({connection, channel}));
}

function RabbitMQ(keepConnection) {
  keepConnection = keepConnection || false;

  let result;
  if (keepConnection) {
    result = Promise
      .tryUntil(RABBITMQ_RETRY_CONFIG, _connectRabbitMQ, Config.RABBITMQ_URL)
      .catch((err) => {
        console.error('[~] Cannot connect to RabbitMQ after several attempts. '
          + 'Process exits...', err);
        process.exit(1);
      });
  } else {
    result = _connectRabbitMQ(Config.RABBITMQ_URL);
  }

  return result.disposer(({connection, channel}) => {
    if (!keepConnection) {
      return channel.close()
        .then(() => connection.close());
    }
  });
}

function _prepareRunEnv(channel) {
  return channel.assertExchange('start', 'fanout', {durable: true})
    .then(() => channel.assertQueue('bot', {durable: true}))
    .then(() => channel.bindQueue('bot', 'start', ''));
}

function _prepareCancelEnv(channel) {
  let privateQueue;
  return channel.assertExchange('stop', 'fanout', {durable: true})
    .then(() => channel.assertQueue('', {exclusive: true}))
    .tap((qok) => privateQueue = qok.queue)
    .then(() => channel.bindQueue(privateQueue, 'stop'))
    .then(() => privateQueue);
}

function prepareChannel(channel) {
  return Promise.resolve(undefined)
    .then(() => _prepareRunEnv(channel))
    .then(() => _prepareCancelEnv(channel));
}

export default {
  MongoDB,
  RabbitMQ,
  prepareChannel
};
