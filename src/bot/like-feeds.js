import _ from 'lodash';
import Promise from 'bluebird';

import PinterestClient from '../pinterest/client';
import Authentication from '../lib/authentication';
import HttpHeaders from '../config/http-headers';

import '../exts/lodash';


export class Bot {
  constructor(accessToken, httpHeaders, type) {
    switch (type) {
      case 'pinterest':
        this.client = new PinterestClient(accessToken, httpHeaders);
    }
  }

  processFeeds(feeds) {
    let unlikedFeeds = _(feeds)
      .filter((feed) => !feeds['liked_by_me'])
      .value();
    let chosenFeeds = _.randomSample(unlikedFeeds, 20, 40);
    console.log(_(chosenFeeds).map((feed) => feed.id).value());

    return Promise.resolve(chosenFeeds)
      .each((feed) => {
        return this.client
          .likePin(feed.id)
          .then((result) => {
            console.log(feed.id, result);
          })
          .delay(5000, 10000);
      });
  }

  run() {
    let numberOfPages = _.random(0, 2);
    this.client
      .openApp()
      .then((body) => {
        let firstFeeds = body.data;
        let bookmark = body.bookmark;
        return this.processFeeds(firstFeeds)
          .delay(3000, 10000)
          .then(() => bookmark);
      })
      .then((bookmark) => {
        this.client.browseMoreFeeds(bookmark, numberOfPages, (feeds, done) => {
          return this.processFeeds(feeds).delay(3000, 10000);
        });
      })
      .catch((exception) => {
        console.log(exception);
      });
  }
}
