import PinterestClient from './pinterest-client';
import Authentication from './lib/authentication';
import HttpHeaders from './config/http-headers';
import Promise from './lib/promise';
import _ from 'lodash';

export class Bot {
  constructor(accessToken, httpHeaders, type) {
    switch (type) {
      case 'pinterest':
        this.client = new PinterestClient(accessToken, httpHeaders);
    }
  }

  performAPin(item) {
    return this.client.likeAPin(item.id)
      .then((status) => console.log(item.id))
      .catch(console.error)
      .delay(2000)
      .then(() => this.client.followUser(item.pinner.id))
      .delay(1000);
  }

  perform(counter, bookmark) {
    if (counter >= 5) {
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
          throw new Error('error');
        }

      })
      .delay(5000)
      .then((nextBookmark) => this.perform(counter + 1, nextBookmark));
  }

  run() {
    this.perform(0);
  }
}
