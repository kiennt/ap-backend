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
    let email = 'dxungngh@gmail.com';
    let password = 'qwerty@A123';
    let headers = HttpHeaders.randomHeaders();
    Authentication.getAccessToken(email, password, headers).then((x) => {
      console.log(x);
    });
  }
}
