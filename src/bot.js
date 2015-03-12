import PinterestClient from './pinterest-client';

export class Bot {
  constructor(accessToken, type) {
    switch (type) {
      case 'pinterest':
        this.client = new PinterestClient(accessToken);
    }
  }

  run() {
    this.client.likeAPin('83879611786469438')
      .then((body) => console.log(body))
      .catch((err) => console.log(err));
    this.client.commentAPin('83879611786469438', 'very cool')
      .then((body) => console.log(body))
      .catch((err) => console.log(err));
  }
}
