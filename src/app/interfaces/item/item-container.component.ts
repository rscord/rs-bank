import {
  Input, Component, Output, EventEmitter, ViewChildren, ElementRef
} from '@angular/core';
import { Item } from '../../classes/item/item';
import { ItemContainer } from '../../classes/item/item-container';
import { ObjectEvent } from '../../classes/object-event';

@Component({
  selector: 'item-container',
  templateUrl: 'item-container.component.html',
  styleUrls: ['item-container.component.css']
})
export class ItemContainerComponent {

  @ViewChildren(ElementRef)
  children;

  @Output()
  itemOver = new EventEmitter<ItemEvent>();

  @Output()
  itemClick = new EventEmitter<ItemEvent>();

  @Output()
  itemDrop = new EventEmitter<ItemEvent>();

  @Output()
  itemDragStart = new EventEmitter<ItemEvent>();

  @Output()
  itemDragEnd = new EventEmitter<ItemEvent>();

  @Input()
  set container(container: ItemContainer) {
    this._container = container;
    this.items = container.getItems();
  }

  get container() {
    return this._container;
  }

  _container: ItemContainer;
  items: ReadonlyArray<Item>;
  mouseOver: ItemEvent;
  hoverIndex = -1;

  onMouseLeave(evt: MouseEvent, slot: number) {
    this.mouseOver = null;
    this.itemOver.emit({
      object: null,
      slot
    });
  }

  onMouseEnter(evt: MouseEvent, slot: number) {
    this.mouseOver = this.createItemEvent(evt, slot);
    this.itemOver.emit(this.mouseOver);
  }


  onDragEnter(evt: DragEvent, index: number) {
    this.hoverIndex = index;
  }

  onDragLeave(evt: DragEvent, index: number) {
    this.hoverIndex = -1;
  }

  onDrop(evt: DragEvent, index: number) {
    evt.preventDefault();
    this.itemDrop.emit(this.createItemEvent(evt, index));
    this.hoverIndex = -1;
  }

  onDragStart(evt: DragEvent, index: number) {
    this.itemDragStart.emit(this.createItemEvent(evt, index));
  }

  onDragEnd(evt: DragEvent, index: number) {
    this.itemDragEnd.emit(null);
  }

  onClick(evt: MouseEvent, index: number) {
    this.itemClick.emit(this.createItemEvent(evt, index));
  }

  getClass(index: number) {
    return 'amount amount-' + this.amountClass(this.items[index]);
  }

  formatAmount(slot: number) {
    const item = this.items[slot];
    if (item.amount >= 1000000) {
      return Math.floor(item.amount / 1000000) + 'M';
    }
    if (item.amount >= 100000) {
      return Math.floor(item.amount / 1000) + 'k';
    }
    return item.amount;
  }

  private createItemEvent(baseEvent, slot: number): ItemEvent {
    return {
      altKey: baseEvent.altKey,
      ctrlKey: baseEvent.ctrlKey,
      shiftKey: baseEvent.shiftKey,
      metaKey: baseEvent.metaKey,
      object: this.items[slot],
      slot
    };
  }

  private amountClass(item: Item) {
    if (item.amount === 0) {
      return '0';
    }
    if (item.amount === 1) {
      return '1';
    }
    if (item.amount === item.stackLimit) {
      return 'limit';
    }
    if (item.amount >= 1000000) {
      return 'm';
    }
    if (item.amount >= 100000) {
      return 'k';
    }
    return 'default';
  }

}

export interface ItemEvent extends ObjectEvent<Item> {
  slot: number;
}
