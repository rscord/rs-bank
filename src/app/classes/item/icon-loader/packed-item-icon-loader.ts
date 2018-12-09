import { Item } from '../item';
import { SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { DomSanitizer } from '@angular/platform-browser';
import { ItemIconLoader } from '../item-icon-loader';

export class PackedItemIconLoader implements ItemIconLoader {

  iconCache: { [key: number]: SafeResourceUrl } = {};
  dataMap: { [itemId: number]: number } = {};
  dataView: DataView;

  constructor(private data: ArrayBuffer, private sanitizer: DomSanitizer) {
    this.dataView = new DataView(data);
    for (let i = 0; i < this.dataView.byteLength;) {
      const id = this.dataView.getUint16(i);
      const len = this.dataView.getUint16(i + 2);
      this.dataMap[id] = i;
      i += len + 4;
    }
  }

  getIconUrl(item: Item) {
    return this.iconCache[item.id] || this.loadIcon(item);
  }

  loadIcon(item: Item) {
    const pos = this.dataMap[item.id];
    if (pos !== undefined) {
      const len = this.dataView.getUint16(pos + 2);
      const buff = this.data.slice(pos + 4, len + pos + 4);
      const blob = new Blob([buff], { type: 'image/gif' });
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      this.iconCache[item.id] = url;
      return url;
    }
    return 'assets/img/note.gif';
  }

}
