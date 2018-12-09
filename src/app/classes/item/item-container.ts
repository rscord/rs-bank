import { Item } from './item';

export abstract class ItemContainer {

  protected items: Item[];
  lockedSlots = [];

  constructor(public readonly size?: number) {
    if (Number.isInteger(size)) {
      this.items = new Array(size).fill(null);
    } else {
      this.items = [];
      this.size = 0;
    }
  }

  abstract add(item: Item, amount: number, slot?: number): number;

  abstract transfer(item: Item, amount: number, to: ItemContainer, fromSlot?: number, toSlot?: number): number;

  abstract transferAll(to: ItemContainer);

  abstract remove(item: Item, amount: number, slot?: number): number;

  count(item: Item) {
    let amount = 0;
    for (let slot = 0; slot < this.items.length; slot++) {
      if (this.items[slot] && this.items[slot].isCopyOf(item)) {
        amount += this.items[slot].amount;
      }
    }
    return amount;
  }

  getItemAt(slot: number) {
    if (slot < 0 || this.items.length < slot || !Number.isInteger(slot)) {
      throw new Error('Invalid slot');
    }
    return this.items[slot];
  }

  findItem(find: Item) {
    const idx = this.indexOf(find);
    return idx === -1 ? null : this.items[idx];
  }

  findItemType(find: Item) {
    const idx = this.indexOfType(find);
    return idx === -1 ? null : this.items[idx];
  }

  indexOf(item: Item) {
    return this.items.indexOf(item);
  }

  hasEnoughOf(ofItem: Item[]) {
    for (const item of ofItem) {
      if (!this.hasItemType(item, item.amount)) {
        return false;
      }
    }
    return true;
  }

  hasItemType(ofItem: Item, amount: number = 1) {
    for (let slot = 0, hasAmount = 0, item: Item; slot < this.items.length; slot++) {
      item = this.items[slot];
      if (item && item.isCopyOf(ofItem)) {
        hasAmount += item.amount;
        if (hasAmount >= amount) {
          return true;
        }
      }
    }
    return false;
  }

  indexOfType(find: Item) {
    for (let slot = 0, item: Item; slot < this.items.length; slot++) {
      item = this.items[slot];
      if (item === find || (item && item.isCopyOf(find))) {
        return slot;
      }
    }
    return -1;
  }

  setItems(items: Item[]) {
    this.items = items.slice();
  }

  getItems(): ReadonlyArray<Item> {
    return this.items;
  }

  move(from: number, to: number) {
    const slotItem = this.items[to];
    this.items[to] = this.items[from];
    this.items[from] = slotItem;
  }

  toggleSlot(slot: number, lock: boolean = !this.lockedSlots[slot]) {
    this.lockedSlots[slot] = lock;
  }

  isLocked(slot: number) {
    return !!this.lockedSlots[slot];
  }

}
