import { ItemContainer } from './item/item-container';
import { Bank } from './bank/bank';
import { EquipmentContainer } from './equipment/equipment-container';
import { SpellBook } from './spells';
import { BaseItemContainer } from './item/base-item-container';
import { PrayerBook } from './prayers';

export class Player {

  inventory: ItemContainer = new BaseItemContainer(28);
  equipment: EquipmentContainer = new EquipmentContainer();
  familiar: ItemContainer = new BaseItemContainer(32);
  bank: Bank = new Bank();
  spellbook = SpellBook.STANDARD;
  prayerbook = PrayerBook.NORMAL;

}
