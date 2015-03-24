import PinterestClient from './pinterest-client';
import Authentication from './lib/authentication';
import HttpHeaders from './config/http-headers';

export class Bot {
  constructor(accessToken, httpHeaders, type) {
    switch (type) {
      case 'pinterest':
        this.client = new PinterestClient(accessToken, httpHeaders);
    }
  }

  run() {
    this.client.getFeeds(25).then((x) => {
      console.log(x);
    });
  }
}
