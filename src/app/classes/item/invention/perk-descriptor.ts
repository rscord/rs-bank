export interface PerkDescriptor {
  readonly name: string;
  readonly description: string;
  readonly icon?: string;
  readonly type: number;
  readonly maxRank: number;
}
