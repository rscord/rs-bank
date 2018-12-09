import { Item } from '../item/item';
import { BankTab } from './bank-tab';
import { ItemContainer } from '../item/item-container';
import { EquipmentContainer } from '../equipment/equipment-container';
import { BaseItemContainer } from '../item/base-item-container';

export class Bank extends BaseItemContainer {

  tabs: BankTab[] = [];
  presets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  withdrawAsNotes = false;
  runeWithdrawalMultiplier = 100;
  private itemCount: number;

  get used() {
    return this.itemCount;
  }

  constructor(items: Item[] = []) {
    super();
    this.setItems(items);
  }

  addTab() {
    const tab = new BankTab(this);
    this.tabs.push(tab);
    return tab;
  }

  removeTab(tab: BankTab) {
    const idx = this.tabs.indexOf(tab);
    if (idx === -1) {
      return;
    }
    if (idx === 0) {
      throw new Error('Cannot remove main tab');
    }
    for (const item of tab.getItems()) {
      this.tabs[0].addItemSlot(item);
    }
    this.tabs.splice(idx, 1);
  }

  changeItemAmount(item: Item, amount: number) {
    if (item.isStackableInBank) {
      item.amount += amount;
      return Math.abs(amount);
    }
    return super.changeItemAmount(item, amount);
  }

  addToTab(tab: BankTab, itemToAdd: Item, amount: number, slot?: number) {
    tab = this.findItemTab(itemToAdd) || tab || this.tabs[0];
    itemToAdd.isNoted = false;
    amount = super.add(itemToAdd, amount, slot);
    if (tab && amount > 0) {
      tab.addItemSlot(itemToAdd);
    }
    this.recalculate();
    return amount;
  }

  add(item: Item, amount: number, slot?: number): number {
    return this.addToTab(null, item, amount, slot);
  }

  remove(item: Item, amount: number, slot: number = this.indexOf(item)) {
    amount = this.changeItemAmount(this.getItemAt(slot), -amount);
    this.recalculate();
    return amount;
  }

  transfer(item: Item, amount: number, to: ItemContainer, fromSlot?: number, toSlot?: number): number {
    if (item === null) {
      return 0;
    } else if (this === to) {
      const idx = this.indexOf(item);
      if (idx > -1) {
        this.move(idx, toSlot);
      }
      return 0;
    } else if (amount < 1) {
      return 0;
    } else if (fromSlot > -1 && this.getItemAt(fromSlot) !== item) {
      throw new Error('Invalid item in slot');
    } else if (this.indexOf(item) === -1) {
      throw new Error('Item not found');
    }
    const clone = item.clone();
    const removed = this.remove(item, amount, fromSlot);
    let added = 0;
    if (to instanceof EquipmentContainer) {
      added = to.equip(clone, removed, this);
    } else {
      clone.isNoted = this.withdrawAsNotes && item.isNoteable;
      added = to.add(clone, removed, toSlot);
    }
    this.add(item, removed - added, fromSlot);
    return added;
  }

  findItemTab(item: Item) {
    return this.tabs.find((t) => t.indexOfType(item) !== -1);
  }

  findItemTabs(item: Item) {
    return this.tabs.filter((t) => t.indexOfType(item) !== -1);
  }

  hasClone(ofItem: Item) {
    let cloneCount = 0;
    return this.tabs.some((tab) =>
      tab.getItems().some((item) => item && item === ofItem && cloneCount++ === 1)
    );
  }

  setItems(items: Item[]) {
    super.setItems(items);
    this.tabs = [];
    this.recalculate();
  }

  checkItem(check: Item) {
    const idx = this.indexOf(check);
    if (idx === -1 || check.amount !== 0 || this.tabs.find((tab) => tab.getItems().indexOf(check) !== -1)) {
      return;
    }
    this.items[idx] = null;
    this.recalculate();
  }

  private recalculate() {
    this.itemCount = 0;
    for (const item of this.items) {
      if (item) {
        this.itemCount++;
      }
    }
  }

}
