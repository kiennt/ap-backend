import PinterestClient from './pinterest-client';

export class Bot {
  constructor(accessToken, httpHeaders, type) {
    switch (type) {
      case 'pinterest':
        this.client = new PinterestClient(accessToken, httpHeaders);
    }
  }

  run() {
    // this.client.likeAPin('83879611786469438')
    //   .then((body) => console.log(body))
    //   .catch((err) => console.log(err));

    // this.client.followUser('10414780296729982')
    //   .then((body) => console.log(body))
    //   .catch((err) => console.log(err));

    // this.client.commentAPin('83879611786469438', 'cool')
    //   .then((body) => console.log(body))
    //   .catch((err) => console.log(err));

    // this.client.getInfoOfMe()
    //   .then((body) => console.log(body))
    //   .catch((err) => console.log(err));
    this.client.getPinsOfUser('164944542510877518', 1)
      .then((body) => console.log(body))
      .catch((body) => console.log(body));
  }
}
