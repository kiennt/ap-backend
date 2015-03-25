import _ from 'lodash';
import Promise from 'bluebird';

import PinterestClient from './pinterest-client';
import Authentication from './lib/authentication';
import HttpHeaders from './config/http-headers';

import './exts/lodash';


export class Bot {
  constructor(accessToken, httpHeaders, type) {
    switch (type) {
      case 'pinterest':
        this.client = new PinterestClient(accessToken, httpHeaders);
        this.numberOfPages = _.random(3, 5);
    }
  }

  performAnUser(user) {
    if (_.randomBoolean()) {
      return this.client.followUser(user.id);
    }
  }

  performAPin(item) {
    return this.client.likeAPin(item.id)
      .then((status) => console.log(item.id))
      .catch(console.error)
      .delay(_.random(3000, 10000))
      .then(() => this.performAnUser(item.pinner))
      .delay(_.random(7000, 15000));
  }

  perform(counter, bookmark) {
    if (counter >= this.numberOfPages) {
      return 0;
    }

    return this.client
      .getFeeds(25, bookmark).then((body) => {
        if (body.data) {
          let unlikedItems = _(body.data)
            .filter((item) => !item['liked_by_me'])
            .value();
          let items = _.randomSample(unlikedItems, 0.4, 0.8);

          console.log(_(unlikedItems).map((item) => item.id).value());
          console.log(_(items).map((item) => item.id).value());

          return Promise.resolve(items)
            .each((item) => this.performAPin(item))
            .return(body.bookmark);
        } else {
          throw new Error('data is null');
        }
      })
      .delay(_.random(10000, 20000))
      .then((nextBookmark) => this.perform(counter + 1, nextBookmark));
  }

  run() {
    this.perform(0);
  }
}
