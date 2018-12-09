import { Gizmo } from './gizmo';

export class Augmentor {

  static xps = [1160, 2607, 5176, 8286, 11760, 15835, 21152, 28761, 40120, 57095, 81960, 117397, 166496, 232886,
    320080, 432785, 575592, 753631, 972440];

  gizmos: [Gizmo, Gizmo];
  private _xp = 0;
  private _level = 0;

  static equals(a: Augmentor, b: Augmentor) {
    return a === b || (a && b && Gizmo.equals(a.gizmos[0], b.gizmos[0]) && Gizmo.equals(a.gizmos[1], b.gizmos[1]));
  }

  constructor(gizmos: [Gizmo, Gizmo] = [null, null]) {
    this.gizmos = gizmos;
  }

  get level() {
    return this._level;
  }

  get xp() {
    return this._xp;
  }

  set xp(xp: number) {
    this._xp = xp;
    let i = 0;
    for (; i < Augmentor.xps.length; i++) {
      if (Augmentor.xps[i] > xp) {
        break;
      }
    }
    this._level = i + 1;
  }

  clone() {
    const augmentor = new Augmentor();
    augmentor.xp = this.xp;
    augmentor.gizmos = <[Gizmo, Gizmo]>this.gizmos.map((gizmo) => gizmo ? gizmo.clone() : null);
    return augmentor;
  }

}
