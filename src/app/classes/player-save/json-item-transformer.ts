import { Transformer } from './transformer';
import { Item } from '../item/item';
import { Gizmo } from '../item/invention/gizmo';
import { Augmentor } from '../item/invention/augmentor';
import { Perk } from '../item/invention/perk';
import { Perks } from '../item/invention/perks';

export class JsonItemTransformer implements Transformer<Item> {

  private static persistable = ['amount', 'isNoted', 'dye', 'charges'];

  from(itemData: any) {
    if (itemData === null) {
      return null;
    }
    let augmentor;
    if (itemData.augmentor) {
      const gizmos = itemData.augmentor.gizmos.map((perks) => {
        perks = perks.map((perk) => {
          for (const p in Perks) {
            if (Perks[p].name === perk.name) {
              return new Perk(Perks[p], perk.rank);
            }
          }
        });
        return new Gizmo(perks[0], perks[1]);
      });
      augmentor = new Augmentor(gizmos);
      augmentor.xp = itemData.augmentor.xp;
    }
    const descriptor = Item.descriptors.find((meta) => meta.id === itemData.id);
    const item = new Item(descriptor);
    item.augmentor = augmentor;
    for (const field of JsonItemTransformer.persistable) {
      if (itemData[field]) {
        item[field] = itemData[field];
      }
    }
    return item;
  }

  to(item: Item) {
    if (item === null) {
      return null;
    }
    const exists = (obj) => !!obj;
    const itemData: any = {
      id: item.id,
      augmentor: undefined
    };
    for (const field of JsonItemTransformer.persistable) {
      if (item[field]) {
        itemData[field] = item[field];
      }
    }
    if (item.augmentor) {
      itemData.augmentor = {
        xp: item.augmentor.xp,
        gizmos: item.augmentor.gizmos.filter(exists).map((gizmo) =>
          gizmo.perks.filter(exists).map((perk) => ({
            name: perk.name,
            rank: perk.rank
          }))
        )
      };
    }
    return itemData;
  }

}
