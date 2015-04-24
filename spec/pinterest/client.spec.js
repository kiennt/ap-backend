import _ from 'lodash';
import Promise from 'bluebird';

import PinterestClient from '../../dist/pinterest/client';
import PinterestApi from '../../dist/pinterest/api';
import httpHeaders from '../../dist/config/http-headers';
import {customError} from '../../dist/lib/errors';


describe('PinterestClient', () => {
  let accessToken = 'this_is_access_token';
  let headers = httpHeaders.randomHeaders();
  let client = new PinterestClient(accessToken, headers);
  let errors = client._errors();

  beforeAll(() => {
    spyOn(Promise, 'delay').and.callFake(function (value, time) {
      value = (time === undefined) ? undefined : value;
      return Promise.resolve(value);
    });
    spyOn(Promise.prototype, 'delay').and.callFake(function () {
      return Promise.resolve(this);
    });
  });

  describe('browseBoard', () => {
    let boardId = 123;
    let maxPage = 3;

    beforeEach(() => {
      spyOn(client.api, 'openBoard').and.returnValue(
        Promise.resolve({pins: {
          bookmark: 1,
          data: [0]
        }}));
    });

    it('should go through exact maxPage', (done) => {
      spyOn(client.api, 'getPinsOfBoard').and.callFake((x, y, bookmark) => {
        return Promise.resolve({
          bookmark: bookmark + 1,
          data: [bookmark]
        });
      });

      let spy = jasmine.createSpy('spy');
      client.browseBoard(boardId, maxPage, spy)
        .then(() => {
          expect(client.api.openBoard).toHaveBeenCalledWith(boardId);
          expect(client.api.getPinsOfBoard.calls.count()).toBe(2);
          expect(spy.calls.count()).toBe(maxPage);
          for (let i = 0; i < maxPage; i++) {
            expect(spy).toHaveBeenCalledWith([i], jasmine.any(Function));
            if (i > 0) {
              expect(client.api.getPinsOfBoard).toHaveBeenCalledWith(
                boardId, 25, i);
            }
          }
        })
        .catch((e) => fail('Should not fail'))
        .then(done);
    });

    it('should end when bookmark is unchanged', (done) => {
      spyOn(client.api, 'getPinsOfBoard').and.callFake((x, y, bookmark) => {
        return Promise.resolve({
          bookmark: bookmark,
          data: []
        });
      });

      let spy = jasmine.createSpy('spy');
      client.browseBoard(boardId, maxPage, spy)
        .then(() => expect(spy.calls.count()).toBe(2))
        .catch((e) => fail('Should not fail'))
        .then(done);
    });

    it('should end immediately when done is called', (done) => {
      let spy = jasmine.createSpy(spy);
      spy.and.callFake((x, done) => done());

      client.browseBoard(boardId, maxPage, spy)
        .then(() => expect(spy.calls.count()).toBe(1))
        .catch((e) => fail('Should not fail'))
        .then(done);
    });

    it('should reject when a page fail', (done) => {
      let SampleError = customError('SampleError');

      let spy = jasmine.createSpy(spy);
      spy.and.callFake((x, y) => {
        throw new SampleError('Hello');
      });

      client.browseBoard(boardId, maxPage, spy)
        .then(() => fail('Should not success'))
        .catch((error) => {
          expect(error).toEqual(jasmine.any(SampleError));
          expect(spy.calls.count(), 1);
        })
        .then(done);
    });
  });

  describe('browseFeeds', () => {
    let firstBookmark = 'firstBookmark';
    let maxPage = 3;

    it('should go through exact maxPage', (done) => {
      spyOn(client.api, 'getFeeds').and.callFake((pageSize, bookmark) => {
        return Promise.resolve({
          bookmark: bookmark + 1,
          data: [bookmark]
        });
      });

      let spy = jasmine.createSpy('spy');
      client.browseFeeds(1, maxPage, spy)
        .then(() => {
          expect(client.api.getFeeds.calls.count()).toBe(3);
          expect(spy.calls.count()).toBe(maxPage);
          for (let i = 1; i < maxPage; i++) {
            expect(client.api.getFeeds).toHaveBeenCalledWith(25, i);
          }
        })
        .catch((e) => fail('Should not fail'))
        .then(done);
    });

    it('should end when bookmark is unchanged', (done) => {
      spyOn(client.api, 'getFeeds').and.callFake((pageSize, bookmark) => {
        return Promise.resolve({
          bookmark: bookmark,
          data: []
        });
      });

      let spy = jasmine.createSpy('spy');
      client.browseFeeds(1, maxPage, spy)
        .then(() => expect(spy.calls.count()).toBe(1))
        .catch((e) => fail('Should not fail'))
        .then(done);
    });

    it('should end immediately when done is called', (done) => {
      spyOn(client.api, 'getFeeds').and.callFake((pageSize, bookmark) => {
        return Promise.resolve({
          bookmark: bookmark,
          data: []
        });
      });

      let spy = jasmine.createSpy(spy);
      spy.and.callFake((data, done) => done());

      client.browseFeeds(1, maxPage, spy)
        .then(() => expect(spy.calls.count()).toBe(1))
        .catch((e) => fail('Should not fail'))
        .then(done);
    });

    it('should reject when a feed fail', (done) => {
      let SampleError = customError('SampleError');
      spyOn(client.api, 'getFeeds').and.callFake((pageSize, bookmark) => {
        return Promise.resolve({
          bookmark: bookmark,
          data: []
        });
      });

      let spy = jasmine.createSpy(spy);
      spy.and.callFake((x, y) => {
        throw new SampleError('Hello');
      });

      client.browseFeeds(1, maxPage, spy)
        .then(() => fail('Should not success'))
        .catch((error) => {
          expect(error).toEqual(jasmine.any(SampleError));
          expect(spy.calls.count(), 1);
        })
        .then(done);
    });
  });

  describe('findAnUser', () => {
    let maxPage = 3;
    let query = 'Nova';
    let userId = 12345;
    let predicate = (user) => user.id === userId;

    beforeAll(() => spyOn(_, 'random').and.returnValue(maxPage));

    it('should go search when autocomplete not found', (done) => {
      spyOn(client, '_autocompleteUser')
        .and.returnValue(Promise.reject(new errors.AutocompleteNotFound()));
      spyOn(client, '_searchUser').and.returnValue(Promise.resolve());
      client.findAnUser(query, predicate)
        .then(() => {
          expect(client._autocompleteUser)
            .toHaveBeenCalledWith(query, predicate);
          expect(client._searchUser)
            .toHaveBeenCalledWith(query, predicate, maxPage);
        })
        .catch((e) => fail('Should not throw error'))
        .then(done);
    });

    it('should not go search when autocomplete found', (done) => {
      spyOn(client, '_autocompleteUser').and.returnValue(Promise.resolve());
      spyOn(client, '_searchUser');
      client.findAnUser(query, predicate)
        .then(() => {
          expect(client._autocompleteUser)
            .toHaveBeenCalledWith(query, predicate);
          expect(client._searchUser).not.toHaveBeenCalled();
        })
        .catch((e) => fail('Should not throw error'))
        .then(done);
    });

    describe('_autocompleteUser', () => {
      it('should throw AutocompleteNotFound when not found', (done) => {
        spyOn(client.api, 'getAutoCompleteText')
          .and.returnValue(Promise.resolve([]));

        client._autocompleteUser(query, predicate)
          .then(() => fail('Should not success'))
          .catch((error) => {
            expect(error).toEqual(jasmine.any(errors.AutocompleteNotFound));
            let stub = client.api.getAutoCompleteText;
            expect(stub.calls.count(), query.length + 1);
            for (let i = 0, n = query.length; i <= n; i++) {
              expect(stub).toHaveBeenCalledWith(query.slice(0, i));
            }
          })
          .then(done);
      });

      it('should return immediately when found', (done) => {
        let successIndex = 2;
        spyOn(client.api, 'getAutoCompleteText').and.callFake((text) => {
          let returnUserId = (text.length === successIndex) ? userId : 0;
          return Promise.resolve([{
              type: 'user',
              id: returnUserId
          }]);
        });

        client._autocompleteUser(query, predicate)
          .then((result) => {
            expect(result.id).toBe(userId);
            let stub = client.api.getAutoCompleteText;
            expect(stub.calls.count(), successIndex + 1);
            for (let i = 0; i <= successIndex; i++) {
              expect(stub).toHaveBeenCalledWith(query.slice(0, i));
            }
          })
          .catch((e) => fail('Should not throw error'))
          .then(done);
      });
    });

    describe('_searchUser', () => {
      it('should throw SearchNotFound when no more results', (done) => {
        spyOn(client.api, 'search').and.returnValue(Promise.resolve({}));
        client._searchUser(query, predicate, maxPage)
          .then(() => fail('Should not success'))
          .catch((error) => {
            expect(error).toEqual(jasmine.any(errors.SearchNotFound));
            expect(client.api.search.calls.count(), 1);
            expect(client.api.search)
              .toHaveBeenCalledWith(query, 25, 'user', undefined);
          })
          .then(done);
      });

      it('should throw SearchNotFound when exceed maxPage', (done) => {
        spyOn(client.api, 'search').and.callFake((x, y, z, bookmark) => {
          bookmark = bookmark || 0;
          return Promise.resolve({
            bookmark: bookmark + 1,
            data: []
          });
        });
        client._searchUser(query, predicate, maxPage)
          .then(() => fail('Should not success'))
          .catch((error) => {
            expect(error).toEqual(jasmine.any(errors.SearchNotFound));
            let stub = client.api.search;
            expect(stub.calls.count(), maxPage);
            expect(stub).toHaveBeenCalledWith(query, 25, 'user', undefined);
            for (let i = 1; i < maxPage; i++) {
              expect(stub).toHaveBeenCalledWith(query, 25, 'user', i);
            }
          })
          .then(done);
      });

      it('should return immediately when found', (done) => {
        let successPage = 2;
        spyOn(client.api, 'search').and.callFake((x, y, z, bookmark) => {
          bookmark = bookmark || 0;
          let returnUserId = (bookmark === successPage - 1) ? userId : 0;
          return Promise.resolve({
            bookmark: bookmark + 1,
            data: [{id: returnUserId}]
          });
        });

        client._searchUser(query, predicate, maxPage)
          .then((result) => {
            expect(result.id).toBe(userId);
            let stub = client.api.search;
            expect(stub.calls.count(), successPage);
            expect(stub).toHaveBeenCalledWith(query, 25, 'user', undefined);
            for (let i = 1; i < successPage; i++) {
              expect(stub).toHaveBeenCalledWith(query, 25, 'user', i);
            }
          })
          .catch((e) => fail('Should not throw error'))
          .then(done);
      });
    });
  });

  describe('openUserPage', () => {
    let userId = 1;
    let fakeUserInfo = {id: 1};
    let fakeBoards = [{id: 1}];
    let fakePins = {data: [{id: 1}]};
    let fakeLikedPins = {data: [{id: 1}]};

    it('should return object when userId is valid', (done) => {
      spyOn(client.api, 'getUserInfo').and.returnValue(
        Promise.resolve(fakeUserInfo)
      );
      spyOn(client.api, 'getUserBoards').and.returnValue(
        Promise.resolve(fakeBoards)
      );
      spyOn(client.api, 'getUserPins').and.returnValue(
        Promise.resolve(fakePins)
      );
      spyOn(client.api, 'getUserLiked').and.returnValue(
        Promise.resolve(fakeLikedPins)
      );

      client.openUserPage(userId)
        .then((result) => {
          let expectedResult = {
            userInfo: fakeUserInfo,
            boards: fakeBoards,
            pins: fakePins.data,
            likedPins: fakeLikedPins.data
          };
          expect(result).toEqual(expectedResult);

          expect(client.api.getUserInfo).toHaveBeenCalledWith(userId);
          expect(client.api.getUserBoards).toHaveBeenCalledWith(userId, 25);
          expect(client.api.getUserPins).toHaveBeenCalledWith(userId, 25);
          expect(client.api.getUserLiked).toHaveBeenCalledWith(userId, 25);
        })
        .catch((e) => {
          fail('Should not throw error');
        })
        .then(done);
    });

    it('should throw error when getting error', (done) => {
      spyOn(client.api, 'getUserInfo').and.returnValue(
        Promise.resolve(fakeUserInfo)
      );
      spyOn(client.api, 'getUserBoards').and.returnValue(
        Promise.resolve(fakeBoards)
      );
      spyOn(client.api, 'getUserPins').and.returnValue(
        Promise.resolve(fakePins)
      );
      spyOn(client.api, 'getUserLiked').and.returnValue(
        Promise.reject('error')
      );

      client.openUserPage(userId)
        .then(() => {
          fail('Should not success');
        })
        .catch((error) => {
          expect(error).toEqual(jasmine.any(errors.CanNotOpenUser));
          expect(client.api.getUserInfo).toHaveBeenCalledWith(userId);
          expect(client.api.getUserBoards).toHaveBeenCalledWith(userId, 25);
          expect(client.api.getUserPins).toHaveBeenCalledWith(userId, 25);
          expect(client.api.getUserLiked).toHaveBeenCalledWith(userId, 25);
        })
        .then(done);
    });
  });

  describe('_openPin', () => {
    let pinId = 1;
    let fakePin = {id: 1};
    let fakeRelatedPins = {data: [{id: 1}]};

    it('should return object when pinId is valid', (done) => {
      spyOn(client.api, 'getDetailOfPin').and.returnValue(
        Promise.resolve(fakePin)
      );
      spyOn(client.api, 'getRelatedPins').and.returnValue(
        Promise.resolve(fakeRelatedPins)
      );

      client._openPin(pinId)
        .then((result) => {
          let expectedResult = {
            pin: fakePin,
            relatedPins: fakeRelatedPins.data
          };
          expect(result).toEqual(expectedResult);
          expect(client.api.getDetailOfPin).toHaveBeenCalledWith(pinId);
          expect(client.api.getRelatedPins).toHaveBeenCalledWith(pinId, 25);
        })
        .catch((e) => {
          fail('Should not throw error');
        })
        .then(done);
    });

    it('should throw error when getting error', (done) => {
      spyOn(client.api, 'getDetailOfPin').and.returnValue(
        Promise.resolve(fakePin)
      );
      spyOn(client.api, 'getRelatedPins').and.returnValue(
        Promise.reject('error')
      );

      client._openPin(pinId)
        .then(() => {
          fail('Should not success');
        })
        .catch((error) => {
          expect(error).toEqual(jasmine.any(errors.CanNotOpenPin));
          expect(client.api.getDetailOfPin).toHaveBeenCalledWith(pinId);
          expect(client.api.getRelatedPins).toHaveBeenCalledWith(pinId, 25);
        })
        .then(done);
    });
  });

  describe('repin', () => {
    let pinId = 1;
    let fakePin = {
      id: 1,
      board: {
        id: 11,
        name: 'this is test name',
        category: 'this is test category'
      },
      description: 'this is description'
    };
    let fakeRelatedPins = {data: [{id: 1}]};

    it('should repin to board with id 1122', (done) => {
      let fakeBoards = [{
        id: 1122,
        name: 'this is test name',
        category: 'this is test category'
      }];

      spyOn(client, '_openPin').and.returnValue(
        Promise.resolve({pin: fakePin, relatedPins: fakeRelatedPins})
      );
      spyOn(client.api, 'getBoardsOfMe').and.returnValue(
        Promise.resolve(fakeBoards)
      );
      spyOn(client.api, 'repin').and.returnValue(
        Promise.resolve('success')
      );

      client.repin(pinId)
        .then((result) => {
          expect(result).toEqual('success');
          expect(client._openPin).toHaveBeenCalledWith(pinId);
          expect(client.api.getBoardsOfMe).toHaveBeenCalled();
          expect(client.api.repin)
            .toHaveBeenCalledWith(pinId, 1122, fakePin.description);
        })
        .catch((e) => {
          fail('Should not throw error');
        })
        .then(done);
    });

    it('should create a new board to repin', (done) => {
      let wrongBoards = [{
        id: 1122,
        name: 'this is OTHER name',
        category: 'this is OTHER category'
      }];

      spyOn(client, '_openPin').and.returnValue(
        Promise.resolve({pin: fakePin, relatedPins: fakeRelatedPins})
      );
      spyOn(client.api, 'getBoardsOfMe').and.returnValue(
        Promise.resolve(wrongBoards)
      );
      spyOn(client.api, 'createABoard').and.returnValue(
        Promise.resolve({
          id: 1123,
          name: 'this is new category',
          category: ''
        })
      );
      spyOn(client.api, 'repin').and.returnValue(
        Promise.resolve('success')
      );

      client.repin(pinId)
        .then((result) => {
          expect(result).toEqual('success');
          expect(client._openPin).toHaveBeenCalledWith(pinId);
          expect(client.api.getBoardsOfMe).toHaveBeenCalled();
          expect(client.api.createABoard)
            .toHaveBeenCalledWith('This Is Test Category');
          expect(client.api.repin)
            .toHaveBeenCalledWith(pinId, 1123, fakePin.description);
        })
        .catch((e) => {
          fail('Should not throw error');
        })
        .then(done);
    });
  });

  describe('openApp', () => {
    let fakeExp = 'fakeExp';
    let fakeNotifications = 'fakeNotifications';
    let fakeFeeds = [{id: 1}, {id: 2}];
    it('should return list of feeds', (done) => {
      spyOn(client.api, 'getExperiments').and.returnValue(
        Promise.resolve(fakeExp)
      );
      spyOn(client.api, 'getNotifications').and.returnValue(
        Promise.resolve(fakeNotifications)
      );
      spyOn(client.api, 'getFeeds').and.returnValue(
        Promise.resolve(fakeFeeds)
      );

      client.openApp()
        .then((result) => {
          expect(result).toEqual(fakeFeeds);
          expect(client.api.getExperiments).toHaveBeenCalled();
          expect(client.api.getNotifications).toHaveBeenCalled();
          expect(client.api.getFeeds).toHaveBeenCalledWith(25);
        })
        .catch((e) => {
          fail('Should not throw error');
        })
        .then(done);
    });
    it('should return error', (done) => {
      spyOn(client.api, 'getExperiments').and.returnValue(
        Promise.resolve(fakeExp)
      );
      spyOn(client.api, 'getNotifications').and.returnValue(
        Promise.reject('error')
      );
      spyOn(client.api, 'getFeeds').and.returnValue(
        Promise.resolve(fakeFeeds)
      );

      client.openApp()
        .then((result) => {
        })
        .catch((error) => {
          expect(error).toEqual(jasmine.any(errors.CanNotOpenApp));
          expect(client.api.getExperiments).toHaveBeenCalled();
          expect(client.api.getNotifications).toHaveBeenCalled();
        })
        .then(done);
    });
  });

  describe('likePin', () => {
    let fakePin = {
      id: 1
    };
    it('should return true', (done) => {
      spyOn(client.api, 'likeAPin').and.returnValue(
        Promise.resolve(true)
      );
      spyOn(client, '_openPin').and.returnValue(
        Promise.resolve(fakePin)
      );

      client.likePin(1)
        .then((result) => {
          expect(result).toEqual(true);
          expect(client.api.likeAPin).toHaveBeenCalledWith(1);
          expect(client._openPin).toHaveBeenCalledWith(1);
        })
        .catch((e) => {
          fail('Should not throw error');
        })
        .then(done);
    });
  });
});
