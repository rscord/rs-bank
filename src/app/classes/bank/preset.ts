import { ItemContainer } from '../item/item-container';
import { EquipmentContainer } from '../equipment/equipment-container';

export class Preset {

  name: string;
  inventory: ItemContainer;
  equipment: EquipmentContainer;
  familiar: ItemContainer;

}
