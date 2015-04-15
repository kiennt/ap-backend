import _ from 'lodash';
import Promise from 'bluebird';

import {customError} from '../lib/errors'
import PinterestApi from './api';


let AutocompleteNotFound = customError('AutocompleteNotFound');
let SearchNotFound = customError('SearchNotFound');
let CanNotOpenUser = customError('CanNotOpenUser');


export default class PinterestClient {
  constructor(accessToken, httpHeaders) {
    this.api = new PinterestApi(accessToken, httpHeaders);
  }

  findAnUser(fullName, predicate) {
    let maxPage = _.random(5, 7);
    return this._autocompleteUser(fullName, predicate)
      .catch(AutocompleteNotFound, (error) => {
        return Promise.delay(this, _.random(100, 2000))
          .then(() => this._searchUser(fullName, predicate, maxPage));
      });
  }

  openUserPage(userId) {
    return this.api
      .getUserInfo(userId)
      .then((userInfo) => {
        return Promise.resolve(userInfo);
      })
      .then((userInfo) => {
        return this.api.getUserBoards(userId, 25).then((boards) => {
          return Promise.resolve({userInfo, boards});
        });
      })
      .then(({userInfo, boards}) => {
        return this.api.getUserPins(userId, 25).then((response) => {
          let pins = response.data;
          return Promise.resolve({userInfo, boards, pins});
        });
      })
      .then(({userInfo, boards, pins}) => {
        return this.api.getUserLiked(userId, 25).then((response) => {
          let likedPins = response.data;
          return Promise.resolve({userInfo, boards, pins, likedPins});
        });
      })
      .catch((error) => {
        throw new CanNotOpenUser(userId);
      });
  }

  _autocompleteUser(query, predicate, sliceIndex) {
    sliceIndex = sliceIndex || 0;
    if (sliceIndex > query.length) {
      throw new AutocompleteNotFound(query);
    } else {
      let newQuery = query.slice(0, sliceIndex);
      return this.api.getAutoCompleteText(newQuery)
        .then((data) => _(data).filter('type', 'user').value())
        .then((data) => _(data).filter(predicate).value()[0])
        .then((result) => {
          if (result) {
            return result;
          } else {
            return this._autocompleteUser(query, predicate, sliceIndex + 1);
          }
        });
    }
  }

  _searchUser(query, predicate, maxPage, currentPage, bookmark) {
    currentPage = currentPage || 1;
    return this.api.search(query, 25, 'user', bookmark)
      .then((body) => {
        let result = _(body.data).filter(predicate).value()[0];
        if (result) {
          return result;
        } else {
          let nextBookmark = body.bookmark;
          if (nextBookmark === bookmark || currentPage >= maxPage) {
            throw new SearchNotFound([query, maxPage]);
          } else {
            return Promise.delay(this, _.random(2000, 4000))
              .then(() => this._searchUser(
                query, predicate, maxPage, currentPage + 1, nextBookmark));
          }
        }
      });
  }

  _errors() {
    return {
      AutocompleteNotFound,
      SearchNotFound,
      CanNotOpenUser
    };
  }
}
