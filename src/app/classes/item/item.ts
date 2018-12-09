import { Dye } from './dye';
import { Augmentor } from './invention/augmentor';
import { ItemDescriptor } from './item-descriptor';
import { ItemIconLoader } from './item-icon-loader';

export class Item {

  static iconLoader: ItemIconLoader;
  static descriptors: ItemDescriptor[];

  private _amount = 0;
  private _isNoted = false;
  private _icon = null;
  augmentor: Augmentor = null;
  dye: Dye = null;
  charges = 0;

  static init(iconLoader: ItemIconLoader, data: any[]) {
    this.iconLoader = iconLoader;
    for (const item of data) {
      item.tradeable = true;
    }
    this.descriptors = <any>Object.freeze(data);
  }

  static create(name: string, amount: number = 1, options: any = {}) {
    const descriptor = this.descriptors.find((meta) => meta.name === name);
    if (!descriptor) {
      throw new Error('Item not found: ' + name);
    }
    const item = new Item(descriptor);
    if (options.gizmos) {
      item.augmentor = new Augmentor(options.gizmos);
      item.augmentor.xp = options.xp;
    }
    item.amount = amount;
    return item;
  }

  constructor(private _descriptor: ItemDescriptor) {
    if (!_descriptor) {
      throw new Error('Item meta cannot be null');
    }
    this._icon = Item.iconLoader.getIconUrl(this);
  }

  get examine() {
    return this._descriptor.examine;
  }

  get combatStats() {
    return this._descriptor.combatStats;
  }

  get isStackable() {
    return this._descriptor.stackable || this.stackLimit > 0 || this.isNoted;
  }

  get isNoteable() {
    return this._descriptor.noteable;
  }

  get isNoted() {
    return this._isNoted;
  }

  get icon() {
    return this._icon;
  }

  set isNoted(noted: boolean) {
    if (!this.isNoteable && noted) {
      throw new Error('Item cannot be noted');
    }
    this._isNoted = noted;
  }

  get stackLimit() {
    if (this.isNoted) {
      return 0;
    }
    return this._descriptor.stackLimit || 0;
  }

  get isStackableInBank() {
    return this._descriptor.stacksinbank;
  }

  get isTradeable() {
    return this._descriptor.tradeable && !this.augmentor;
  }

  get id() {
    return this._descriptor.id;
  }

  get name() {
    let name = this._descriptor.name;
    if (this.augmentor) {
      name = 'Augmented ' + name;
    }
    if (this.dye) {
      name += `(${this.dye})`;
    }
    return name;
  }

  get options() {
    return this._descriptor.options || [];
  }

  set amount(amount: number) {
    if (amount < 0) {
      throw new Error('Invalid amount');
    }
    this._amount = amount;
  }

  get amount() {
    return this._amount;
  }

  isCopyOf(item: Item) {
    if (item === this) {
      return true;
    }
    return item &&
      this._descriptor.id === item._descriptor.id &&
      this._isNoted === item._isNoted &&
      this.dye === item.dye &&
      Augmentor.equals(this.augmentor, item.augmentor);
  }

  clone() {
    const item = new Item(this._descriptor);
    if (this.augmentor) {
      item.augmentor = this.augmentor.clone();
    }
    item.dye = this.dye;
    item.charges = this.charges;
    return item;
  }

}
