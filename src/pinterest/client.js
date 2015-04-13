import _ from 'lodash';
import Promise from 'bluebird';

import PinterestApi from './api';


export default class PinterestClient {
  constructor(accessToken, httpHeaders) {
    this.api = new PinterestApi(accessToken, httpHeaders);
  }

  repin(pinId) {
    return this.api
      .getDetailOfPin(pinId)
      .then((pin) => {
        return Promise.resolve(pin);
      })
      .then((pin) => {
        return this.api.getBoardsOfMe().then((boards) => {
          return Promise.resolve({pin, boards});
        });
      })
      .delay(_.random(5000, 30000))
      .then(({pin, boards}) => {
        let chosenBoard;
        boards.forEach((board) => {
          if (board.name === pin.board.name) {
            chosenBoard = board;
          }
        });
        if (chosenBoard) {
          return Promise.resolve({pin, chosenBoard});
        } else {
          return this.api.createABoard(pin.board.name).then((chosenBoard) => {
            return Promise.resolve({pin, chosenBoard});
          });
        }
      })
      .then(({pin, chosenBoard}) => {
        return this.api.repin(pin.id, chosenBoard.id, pin.description);
      });
  }
}
