import _ from 'lodash';
import Promise from 'bluebird';

import PinterestClient from '../pinterest-client';
import Authentication from '../lib/authentication';
import HttpHeaders from '../config/http-headers';

import '../exts/lodash';


let targetQuery = 'Nova Trương';
let targetUsername = 'novadev94';
let targetId = '???';

let specialBreak = 0x1234;
let predicate = (e) => (e.username === targetUsername || e.id === targetId);


export class Bot {
  constructor(accessToken, httpHeaders, type) {
    switch (type) {
      case 'pinterest':
        this.client = new PinterestClient(accessToken, httpHeaders);
    }
  }

  performAutocomplete(query, sliceIndex=0) {
    if (sliceIndex > query.length) {
      throw specialBreak;
    } else {
      let newQuery = query.slice(0, sliceIndex);
      console.log(`* Autocomplete: '${newQuery}'`);
      return this.client.getAutoCompleteText(newQuery)
        .then((data) => _(data).filter('type', 'user').value())
        .then((data) => _(data).filter(predicate).value()[0])
        .then((result) => {
          if (result) {
            return result;
          } else {
            console.log('=> Not found! Continue with next character!');
            return this.performAutocomplete(query, sliceIndex + 1);
          }
        });
    }
  }

  performSearch(query, bookmark) {
    console.log(`* Perform an user search with: '${query}'`);
    return this.client.search(query, 25, 'user')
      .then((body) => {
        let result = _(body.data).filter(predicate).value()[0];
        // TODO: Chỗ này cần chờ support bookmark từ Search
        return result;
      });
  }

  run() {
    this.performAutocomplete(targetQuery)
      .catch((error) => this.performSearch(targetQuery))
      .then((user) => {
        // We found the user by using appropriate behaviors
        // There's no risk about it
        console.log(user);
      });
  }
}
