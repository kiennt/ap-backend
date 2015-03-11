import { PinterestClient } from './pinterest-client';

var testCallback = function (error, response, body) {
  if (!error) {
    switch (response.statusCode) {
      case 200:
        console.log(body);
        break;
      case 401:
        console.log(body);
        break;
      default:
    }
  } else {
    throw error;
  }
};

export class Bot {
  constructor(accessToken, type) {
    switch (type) {
      case 'pinterest':
        this.client = new PinterestClient(accessToken);
    }
  }

  run() {
    this.client.likeAPin('83879611786469438', testCallback);
  }
}
