import { PerkDescriptor } from './perk-descriptor';

export class Perk {

  private _rank: Rank;

  static equals(a: Perk, b: Perk) {
    return a === b || (a && b && a.rank === b.rank && a.name === b.name);
  }

  constructor(private _meta: PerkDescriptor, rank: Rank) {
    if (_meta.maxRank < rank || rank < 1) {
      throw new Error('Invalid perk rank');
    }
    this._rank = rank;
  }

  get name() {
    return this._meta.name;
  }

  get icon() {
    return this._meta.icon;
  }

  get rank() {
    return this._rank;
  }

  get type() {
    return this._meta.type;
  }

  clone() {
    return new Perk(this._meta, this.rank);
  }

}

export type Rank = 1 | 2 | 3 | 4 | 5;
