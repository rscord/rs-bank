import { WeaponStyle } from './weapon-style';
import { EquipmentSlot } from '../equipment/equipment-slot';
import { ItemClass } from './item-class';

export interface CombatStats {
  readonly augmentable?: boolean;
  readonly damage?: number;
  readonly damageOff?: number;
  readonly accuracy?: number;
  readonly accuracyOff?: number;
  readonly style?: WeaponStyle;
  readonly slot: EquipmentSlot;
  readonly armour?: number;
  readonly lifePoints?: number;
  readonly prayer?: number;
  readonly strength?: number;
  readonly ranged?: number;
  readonly magic?: number;
  readonly pvmReduction?: number;
  readonly pvpReduction?: number;
  readonly tier?: number;
  readonly itemClass?: ItemClass;
}
