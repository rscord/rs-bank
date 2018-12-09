const fs = require('fs');
const http = require('http');
const Stream = require('stream').Transform;
const Buffer = require('buffer').Buffer;

const pack = fs.createWriteStream('item_icons.pak', 'ASCII');
const items = require('../src/assets/items.json');

const BASE_URL = 'http://services.runescape.com/m=itemdb_rs/1522747882863_obj_sprite.gif?id=';
const ICON_DIR = '../src/assets/item-icon';

(async () => {
  const head = Buffer.allocUnsafe(4);
  for (let item of items) {
    const data = await download(item.id);
    head.writeUInt16BE(item.id, 0);
    head.writeUInt16BE(data.length, 2);
    console.log('Packing:', item.id);
    await write(head);
    await write(data);
  }
})();

function write(data) {
  return new Promise((resolve) => pack.write(data, resolve));
}

function download(id) {
  return new Promise((resolve) => {
    const imagePath = `${ICON_DIR}/${id}.gif`;
    let data = fs.readFileSync(imagePath);
    if (data) {
      return resolve(data);
    }
    const url = BASE_URL + id;
    http.request(url, (response) => {
      data = new Stream();
      response
        .on('data', data.push.bind(data))
        .on('end', () => resolve(data.read()));
    }).end();
  });

}
