import { PinterestClient } from './pinterest-client';

export class Bot {
  constructor(authKey, type) {
    switch (type) {
      case "pinterest":
        this.client = new PinterestClient(authKey);
    }
  }

  run() {
    this.client.likeAPin("83879611786469438");
  }
}
