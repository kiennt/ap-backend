import _ from 'lodash';
import Promise from 'bluebird';
let request = Promise.promisifyAll(require('request'));

import utils from './test-utils';
import Config from './shared/config';


export default class BotCounter {
  constructor() {
    this.localBots = 0;
    this.totalBots = 0;
    this.consumers = 1;

    this.fetch()
      .then(() => setInterval(this.fetch.bind(this), 2000));
  }

  log() {
    return `Local: ${this.localBots}. Total: ${this.totalBots}. Consumers: ${this.consumers}. Avg: ${this.totalBots / this.consumers}`;
  }

  shouldAccept() {
    if (this.totalBots <= 0) {
      return true;
    } else {
      return this.localBots <= this.totalBots / this.consumers;
    }
  }

  fetch() {
    let url = Config.RABBITMQ_MANAGEMENT_URL +
      Config.RABBITMQ_MANAGEMENT_METRICS_PATH +
      '?columns=messages,messages_ready,messages_unacknowledged,consumers';

    return request.getAsync(url)
      .spread((response, body) => {
        if (response.statusCode === 200) {
          let data = JSON.parse(body);
          // this.totalBots = data['messages_unacknowledged'];
          // this.consumers = data['consumers'] || 1;
          // console.log('... fetched ... ' + body);
        }
      }, null);
  }

  onFinish() {
    this.localBots -= 1;
    this.totalBots -= 1;
  }

  onIncoming() {
    this.totalBots += (this.consumers - 1);
  }

  onAccept() {
    this.localBots += 1;
    this.totalBots += 1;
  }

  onReject() {
    this.totalBots += 1;
  }

  onCancelOwnBot() {
    this.localBots -= 1;
    this.totalBots -= 1;
  }

  onCancelUnownBot() {
    this.totalBots -= 1;
  }
}
