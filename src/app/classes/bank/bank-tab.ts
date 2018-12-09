import { Item } from '../item/item';
import { ItemContainer } from '../item/item-container';
import { Bank } from './bank';
import { Tab } from './tab';
import { BaseItemContainer } from '../item/base-item-container';

export class BankTab extends BaseItemContainer implements Tab {

  name: string;
  customIcon: string;
  color?: string;
  keybind?: string;
  get icon() {
    if (this.customIcon) {
      return this.customIcon;
    }
    if (this.items.length > 0) {
      const item = this.items[0] || this.items.find((i) => !!i);
      if (item) {
        return item.icon;
      }
    }
  }

  constructor(public bank: Bank, items: Item[] = []) {
    super(0);
    this.items = items;
  }

  add(item: Item, amount: number, slot?: number): number {
    return this.bank.addToTab(this, item, amount, slot);
  }

  transfer(item: Item, amount: number, to: ItemContainer, fromSlot?: number, toSlot?: number) {
    if (item === null) {
      return;
    }
    if (to instanceof BankTab) {
      this.moveItemSlot(fromSlot, toSlot, to);
      return 0;
    }
    return this.bank.transfer(item, amount, to, undefined, toSlot);
  }

  count(item: Item) {
    return this.bank.count(item);
  }

  remove(item: Item, amount: number, slot?: number) {
    return this.bank.remove(item, amount, slot);
  }

  getItemAt(slot: number) {
    return this.bank.getItemAt(slot);
  }

  findItem(item: Item) {
    return this.bank.findItem(item);
  }

  copyItemSlot(fromSlot: number, toSlot?: number, toTab: BankTab = this) {
    if (fromSlot < 0) {
      return false;
    }
    const item = this.items[fromSlot];
    if (!item) {
      return false;
    }
    if (toSlot > -1) {
      if (this.items[toSlot]) {
        return;
      }
      this.items[toSlot] = item;
    } else {
      toTab.addItemSlot(item);
    }
  }

  moveItemSlot(fromSlot: number, toSlot?: number, toTab: BankTab = this) {
    if (fromSlot < 0) {
      return false;
    }
    const item = this.items[fromSlot];
    if (!item) {
      return false;
    }
    if (toSlot === undefined) {
      if (toTab.indexOf(item) === -1) {
        toTab.addItemSlot(item);
        this.items[fromSlot] = null;
      }
    } else {
      const itemInSlot = toTab.items[toSlot];
      this.items[fromSlot] = itemInSlot;
      toTab.items[toSlot] = item;
    }
    return true;
  }

  addItemSlot(item: Item, toSlot?: number) {
    if (toSlot > -1) {
      if (!this.items[toSlot]) {
        this.items[toSlot] = item;
        return true;
      }
      return false;
    }
    if (this.hasItemType(item)) {
      return false;
    }
    for (let i = 0; i < this.items.length; i++) {
      if (!this.items[i]) {
        this.items[i] = item;
        return true;
      }
    }
    this.items.push(item);
    return true;
  }

  deleteItemSlot(slot: number) {
    if (slot < 0) {
      return 0;
    }
    const item = this.items[slot];
    if (!item || (item.amount > 0 && !this.bank.hasClone(item))) {
      return 0;
    }
    this.items[slot] = null;
    this.bank.checkItem(item);
    this.trim();
    return 1;
  }

  autoArrange() {
    for (let i = this.items.length; i >= 0; i--) {
      if (!this.items[i]) {
        continue;
      }
      for (let i2 = 0; i2 < i; i2++) {
        if (this.items[i2] === null) {
          this.items[i2] = this.items[i];
          this.items[i] = null;
          break;
        }
        if (i2 === i - 1) {
          this.trim();
          return;
        }
      }
    }
  }

  private trim() {
    for (let i = this.items.length; i >= 0; i--) {
      if (this.items[i]) {
        this.items.splice(i + 1, this.items.length);
        return;
      }
    }
  }

}
