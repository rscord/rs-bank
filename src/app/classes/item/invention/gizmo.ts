import { Perk } from './perk';

export class Gizmo {

  perks: [Perk, Perk];

  constructor(perkA: Perk, perkB: Perk) {
    this.perks = [perkA, perkB];
  }

  static equals(a: Gizmo, b: Gizmo) {
    if (a === b) {
      return true;
    }
    if (!a || !b || a.perks.length !== b.perks.length) {
      return false;
    }
    for (let i = 0, bPerk, aPerk; i < a.perks.length; i++) {
      aPerk = a.perks[i];
      bPerk = b.perks[i];
      if (!aPerk && !bPerk) {
        continue;
      }
      if (!Perk.equals(aPerk, bPerk)) {
        return false;
      }
    }
    return true;
  }

  clone() {
    const perks = this.perks.map((perk) => perk ? perk.clone() : null);
    return new Gizmo(perks[0], perks[1]);
  }

}
