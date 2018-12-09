import { Item } from './item';
import { ItemDescriptor } from './item-descriptor';

export interface ItemIconLoader {

  getIconUrl(item: Item | ItemDescriptor);

}
