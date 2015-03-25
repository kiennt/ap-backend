import PinterestClient from './pinterest-client';
import Authentication from './lib/authentication';
import HttpHeaders from './config/http-headers';
import RandomUtil from './lib/random-util';
import Promise from './lib/promise';
import _ from 'lodash';

export class Bot {
  constructor(accessToken, httpHeaders, type) {
    switch (type) {
      case 'pinterest':
        this.client = new PinterestClient(accessToken, httpHeaders);
        this.maxRetry = RandomUtil.randomMaxRetry(3, 5);
    }
  }

  performAPin(item) {
    return this.client.likeAPin(item.id)
      .then((status) => console.log(item.id))
      .catch(console.error)
      .delay(RandomUtil.randomDelay(1, 2))
      .then(() => this.client.followUser(item.pinner.id))
      .delay(RandomUtil.randomDelay(2, 4));
  }

  perform(counter, bookmark) {
    console.log(this.maxRetry);
    if (counter >= this.maxRetry) {
      return 0;
    }

    return this.client
      .getFeeds(25, bookmark).then((body) => {
        if (body.data) {
          let unlikedItems = _(body.data)
            .filter((item) => !item['liked_by_me'])
            .value();

          let items = _(unlikedItems)
            .sample(_.random(unlikedItems.length))
            .value();

          console.log(_(items).map((item) => item.id).value());

          return Promise.resolve(items)
            .each((item) => this.performAPin(item))
            .return(body.bookmark);
        } else {
          throw new Error('data is null');
        }
      })
      .delay(RandomUtil.randomDelay(3, 5))
      .then((nextBookmark) => this.perform(counter + 1, nextBookmark));
  }

  run() {
    this.perform(0);
  }
}
