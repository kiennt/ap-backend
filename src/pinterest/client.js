import _ from 'lodash';
import Promise from 'bluebird';

import {customError} from '../lib/errors'
import PinterestApi from './api';


let AutocompleteNotFound = customError('AutocompleteNotFound');
let SearchNotFound = customError('SearchNotFound');
let CanNotOpenPin = customError('CanNotOpenPin');
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
    let promises = [
      this.api.getUserInfo(userId),
      this.api.getUserBoards(userId, 25),
      this.api.getUserPins(userId, 25).get('data'),
      this.api.getUserLiked(userId, 25).get('data')
    ];
    return Promise.all(promises)
      .spread((userInfo, boards, pins, likedPins) => {
        return {userInfo, boards, pins, likedPins};
      })
      .catch((error) => {
        throw new CanNotOpenUser(userId);
      });
  }

  repin(pinId) {
    let pinDetail = this._openPin(pinId);
    return pinDetail
    .then(({pin, relatedPins}) => {
      return this.api.getBoardsOfMe().then((boards) => {
        return Promise.resolve({pin, boards});
      });
    })
    .delay(_.random(20000, 200000))
    .then(({pin, boards}) => {
      let chosendBoard = _(boards).find((board) => {
        if (board.name === pin.board.name) {
          return board;
        }
      });
      if (chosendBoard) {
        return this.api.repin(pinId, chosendBoard.id, pin.description);
      } else {
        return this.api.createABoard(pin.board.name).then((board) => {
          return this.api.repin(pinId, board.id, pin.description);
        });
      }
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

  _openPin(pinId) {
    let promises = [
      this.api.getDetailOfPin(pinId),
      this.api.getRelatedPins(pinId, 25).get('data')
    ];
    return Promise.all(promises)
      .spread((pin, relatedPins) => {
        return {pin, relatedPins};
      })
      .catch((error) => {
        throw new CanNotOpenPin(pinId);
      });
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
      CanNotOpenPin,
      CanNotOpenUser
    };
  }
}
