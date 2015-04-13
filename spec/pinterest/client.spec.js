import _ from 'lodash';
import Promise from 'bluebird';

import PinterestClient from '../../dist/pinterest/client';
import PinterestApi from '../../dist/pinterest/api';
import httpHeaders from '../../dist/config/http-headers';


describe('PinterestClient', () => {
  let accessToken = 'this_is_access_token';
  let headers = httpHeaders.randomHeaders();
  let client = new PinterestClient(accessToken, headers);

  beforeAll(() => spyOn(Promise, 'delay').and.returnValue(Promise.resolve()));

  describe('findAnUser', () => {
    let maxPage = 3;
    let query = 'Nova';
    let userId = 12345;
    let predicate = (user) => user.id === userId;

    beforeAll(() => spyOn(_, 'random').and.returnValue(maxPage));

    it('should go search when autocomplete not found', (done) => {
      let AutocompleteNotFound = client._errors().AutocompleteNotFound;
      spyOn(client, '_autocompleteUser')
        .and.returnValue(Promise.reject(new AutocompleteNotFound()));
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
            expect(error.name).toBe('AutocompleteNotFound');
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
            expect(error.name).toBe('SearchNotFound');
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
            expect(error.name).toBe('SearchNotFound');
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
});
