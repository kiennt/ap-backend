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
    this.client.search('kiennt', 1, 'user').then((x) => {
      console.log(x);
    });

    this.client.search('sex toy', 1, 'pin').then((x) => {
      console.log(x);
    });
  }
}
