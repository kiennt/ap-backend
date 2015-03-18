import PinterestClient from './pinterest-client';

export class Bot {
  constructor(accessToken, httpHeaders, type) {
    switch (type) {
      case 'pinterest':
        this.client = new PinterestClient(accessToken, httpHeaders);
    }
  }

  run() {
    this.client.likeAPin('83879611786469438')
      .then((status) => console.log(status))
      .catch((err) => console.log(err));

    this.client.followUser('10414780296729982')
      .then((status) => console.log(status))
      .catch((err) => console.log(err));

    this.client.commentAPin('83879611786469438', 'cool')
      .then((status) => console.log(status))
      .catch((err) => console.log(err));

    this.client.getInfoOfMe()
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    this.client.search('dungnh', 1, 'user')
      .then((body) => console.log(body))
      .catch((body) => console.log(body));
  }
}
