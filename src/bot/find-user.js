import _ from 'lodash';
import Promise from 'bluebird';

import PinterestClient from '../pinterest/client';
import Authentication from '../lib/authentication';
import HttpHeaders from '../config/http-headers';

import '../exts/lodash';


let targetQuery = 'Nova Trương';
let targetUsername = 'novadev94';
let targetId = '???';

let predicate = (e) => (e.username === targetUsername || e.id === targetId);


export class Bot {
  constructor(accessToken, httpHeaders, type) {
    switch (type) {
      case 'pinterest':
        this.client = new PinterestClient(accessToken, httpHeaders);
    }
  }

  run() {
    this.client.findAnUser(targetQuery, predicate)
      .then((user) => {
        // We found the user by using appropriate behaviors
        // There's no risk about it
        console.log(user);
      })
      .catch((e) => e.name === 'SearchNotFound');
  }
}
