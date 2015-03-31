import _ from 'lodash';
import Promise from 'bluebird';

import PinterestApi from '../pinterest/api';
import Authentication from '../lib/authentication';
import HttpHeaders from '../config/http-headers';

import '../exts/lodash';


let targetQuery = 'Nova Trương';
let targetUsername = 'novadev94';
let targetId = '???';

let maxSearchPage = _.random(5, 7);

let autocompleteNotFound = 0x1234;
let searchNotFound = 0x4321;

let predicate = (e) => (e.username === targetUsername || e.id === targetId);


export class Bot {
  constructor(accessToken, httpHeaders, type) {
    switch (type) {
      case 'pinterest':
        this.api = new PinterestApi(accessToken, httpHeaders);
    }
  }

  performAutocomplete(query, sliceIndex=0) {
    if (sliceIndex > query.length) {
      throw autocompleteNotFound;
    } else {
      let newQuery = query.slice(0, sliceIndex);
      console.log(`* Autocomplete: '${newQuery}'`);
      return this.api.getAutoCompleteText(newQuery)
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

  performSearch(query, currentPage, bookmark) {
    currentPage = currentPage || 1;
    console.log(`* Perform an user search with: '${query}' | ${bookmark}`);
    return this.api.search(query, 25, 'user', bookmark)
      .then((body) => {
        let result = _(body.data).filter(predicate).value()[0];
        if (result) {
          return result;
        } else {
          let nextBookmark = body.bookmark;
          if (nextBookmark === bookmark || currentPage >= maxSearchPage) {
            throw searchNotFound;
          } else {
            return Promise.delay(this, _.random(2000, 4000))
              .then(() => this.performSearch(
                query, currentPage + 1, nextBookmark));
          }
        }
      });
  }

  run() {
    this.performAutocomplete(targetQuery)
      .catch((error) => {
        if (error === autocompleteNotFound) {
          return Promise.delay(this, _.random(100, 2000))
            .then(() => this.performSearch(targetQuery));
        } else {
          throw error;
        }
      })
      .then((user) => {
        // We found the user by using appropriate behaviors
        // There's no risk about it
        console.log(user);
      })
      .catch(() => console.error('Can not found with any ways'));
  }
}
