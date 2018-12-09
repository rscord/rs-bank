import { ItemContainer } from '../item/item-container';
import { Item } from '../item/item';
import { EquipmentSlot } from './equipment-slot';
import { BaseItemContainer } from '../item/base-item-container';

export class EquipmentContainer extends BaseItemContainer {

  public static SIZE = Object.keys(EquipmentSlot).length / 2;

  constructor() {
    super(EquipmentContainer.SIZE);
  }

  add(itemToAdd: Item, amount: number = 1): number {
    if (amount <= 0 || !itemToAdd.combatStats) {
      return 0;
    }
    const slot = itemToAdd.combatStats.slot;
    const itemAtSlot = this.items[slot] = this.items[slot] || itemToAdd;
    if (!itemAtSlot.isCopyOf(itemToAdd)) {
      return 0;
    }
    return this.changeItemAmount(itemAtSlot, amount);
  }

  equip(item: Item, amount: number = 1, depositTo: ItemContainer): number {
    if (!item.combatStats) {
      return 0;
    }
    item.isNoted = false;
    const equipped = this.getItemAt(item.combatStats.slot);
    if (equipped && !equipped.isCopyOf(item)) {
      this.unequip(equipped, depositTo);
    }
    return this.add(item, amount);
  }

  unequip(slot: Item | number, depositTo: ItemContainer): number {
    if (slot instanceof Item) {
      if (!slot.combatStats) {
        return 0;
      }
      slot = slot.combatStats.slot;
    }
    if (slot < 0) {
      return 0;
    }
    const equipped = this.getItemAt(slot);
    if (equipped) {
      const amount = this.remove(equipped, equipped.amount, slot);
      depositTo.add(equipped, amount);
      return amount;
    }
  }

  transfer(item: Item, amount: number, to: ItemContainer, fromSlot?: number, toSlot?: number) {
    if (this === to) {
      return 0;
    }
    return super.transfer(item, amount, to, fromSlot, toSlot);
  }

}
