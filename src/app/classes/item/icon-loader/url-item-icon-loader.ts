import { Item } from '../item';
import { ItemIconLoader } from '../item-icon-loader';
import { ItemDescriptor } from '../item-descriptor';

export class UrlItemIconLoader implements ItemIconLoader {

  private parts: string[];

  constructor(baseUrl: string) {
    this.parts = baseUrl.split(':id');
  }

  getIconUrl(item: Item | ItemDescriptor) {
    return this.parts[0] + item.id + this.parts[1];
  }

}
