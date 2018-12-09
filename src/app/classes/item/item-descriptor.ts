import { CombatStats } from './combat-stats';
import { ItemOption } from './item-option';

export interface ItemDescriptor {
  readonly id: number;
  readonly name?: string;
  readonly tradeable?: boolean;
  readonly combatStats?: CombatStats;
  readonly options?: ItemOption[];
  readonly value?: number;
  readonly examine?: string;
  readonly weight?: number;
  readonly noteable?: boolean;
  readonly stackable?: boolean;
  readonly stacksinbank?: boolean;
  readonly stackLimit?: number;
  readonly members?: boolean;
}
