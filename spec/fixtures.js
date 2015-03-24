import fs from 'fs';
import path from 'path';

import Promise from 'bluebird';


let fixtureDir = path.join(__dirname, '../spec/fixture');

export function fixtureAsync(fixtureName) {
  let fixturePath = path.join(fixtureDir, fixtureName);
  return Promise.promisify(fs.readFile)(fixturePath);
}

export function fixture(fixtureName) {
  let fixturePath = path.join(fixtureDir, fixtureName);
  return fs.readFileSync(fixtureName).toString();
}
