import { ItemContainer } from '../item/item-container';
import { Item } from '../item/item';

export class SearchItemContainer extends ItemContainer {

  add(item: Item, amount: number, slot?: number): number {
    throw new Error('Method not implemented.');
  }

  transfer(item: Item, amount: number, to: ItemContainer, fromSlot?: number, toSlot?: number): number {
    throw new Error('Method not implemented.');
  }

  transferAll(to: ItemContainer) {
    throw new Error('Method not implemented.');
  }

  remove(item: Item, amount: number, slot?: number): number {
    throw new Error('Method not implemented.');
  }

}
