import { Item } from './item';
import { ItemContainer } from './item-container';

export class BaseItemContainer extends ItemContainer {

  protected changeItemAmount(item: Item, amount: number) {
    if (item.isStackable) {
      if (item.stackLimit > 0) {
        amount = Math.min(item.stackLimit - item.amount, amount);
      }
      amount = Math.max(-item.amount, amount);
    } else if (item.amount === 0 && amount > 0) {
      amount = 1;
    } else if (item.amount === 1 && amount < 0) {
      amount = -1;
    } else {
      amount = 0;
    }
    item.amount += amount;
    return Math.abs(amount);
  }

  add(item: Item, amount: number = 1, slot?: number): number {
    if (amount <= 0) {
      return 0;
    }
    let remaining = amount;
    if (slot > -1) {
      remaining -= this.changeExistingAmount(item, remaining, slot);
    }
    for (slot = 0; slot < this.items.length && remaining > 0; slot++) {
      remaining -= this.changeExistingAmount(item, remaining, slot);
    }
    while (remaining > 0) {
      const freeSlot = this.indexOf(null);
      if (freeSlot === -1 && this.size) {
        break;
      }
      remaining -= this.changeItemAmount(item, remaining);
      if (freeSlot === -1) {
        this.items.push(item);
      } else {
        this.items[freeSlot] = item;
      }
      item = item.clone();
    }
    return amount - remaining;
  }

  transfer(item: Item, amount: number, to: ItemContainer, fromSlot?: number, toSlot?: number) {
    if (this === to) {
      const idx = this.indexOf(item);
      if (idx > -1) {
        const slotItem = this.items[toSlot];
        this.items[toSlot] = item;
        this.items[idx] = slotItem;
      }
      return 0;
    }
    if (amount < 1) {
      return 0;
    }
    const thisItem = this.items.find((i) => i === item);
    if (!thisItem) {
      throw new Error('Item not found');
    }
    const removed = this.remove(thisItem, amount, fromSlot);
    const added = to.add(thisItem.clone(), removed, toSlot);
    this.add(thisItem, removed - added, fromSlot);
    return added;
  }

  transferAll(to: ItemContainer) {
    for (let slot = this.items.length, item: Item; slot >= 0; slot--) {
      item = this.items[slot];
      if (item && !this.isLocked(slot)) {
        const added = to.add(item.clone(), item.amount);
        this.remove(item, added, slot);
      }
    }
  }

  remove(item: Item, amount: number, slot?: number) {
    let remaining = amount;
    if (slot > -1) {
      remaining -= this.changeExistingAmount(item, -remaining, slot);
    }
    for (slot = this.items.length; slot >= 0 && remaining > 0; slot--) {
      remaining -= this.changeExistingAmount(item, -remaining, slot);
    }
    return amount - remaining;
  }

  private changeExistingAmount(item: Item, amount: number, slot: number) {
    const existingItem = this.items[slot];
    if (existingItem && existingItem.isCopyOf(item)) {
      const change = this.changeItemAmount(existingItem, amount);
      if (existingItem.amount === 0) {
        this.items[slot] = null;
      }
      return change;
    }
    return 0;
  }

}
