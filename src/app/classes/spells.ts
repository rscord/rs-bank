import { Item } from './item/item';

export class Spells {

  private static _all;
  private static bookCache = [];

  static init(data: any[]) {
    for (const spell of data) {
      spell.book = SpellBook[spell.book];
      spell.runes = spell.runes.map((req) => Object.freeze(Item.create(req.rune, req.amount)));
    }
    this._all = Object.freeze(data);
  }

  static get ALL() {
    return this._all;
  }

  static get(book: SpellBook) {
    if (this.bookCache[book]) {
      return this.bookCache[book];
    }
    return this.bookCache[book] = Spells.ALL.filter((spell) => spell.book === book);
  }

}

export enum SpellBook {
  STANDARD,
  ANCIENT,
  LUNAR
}
