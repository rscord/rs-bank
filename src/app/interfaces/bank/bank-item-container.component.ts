import { AfterViewInit, Component, DoCheck, ElementRef, HostListener, Input } from '@angular/core';
import { ItemContainerComponent } from '../item/item-container.component';
import { ItemContainer } from '../../classes/item/item-container';
import { Item } from '../../classes/item/item';

@Component({
  selector: 'bank-item-container',
  templateUrl: '../item/item-container.component.html',
  styleUrls: [
    '../item/item-container.component.css'
  ]
})
export class BankItemContainerComponent extends ItemContainerComponent implements DoCheck, AfterViewInit {


  @Input()
  set container(container: ItemContainer) {
    this._container = container;
    setTimeout(this.calculate.bind(this));
  }

  get container() {
    return this._container;
  }

  private visibleItems: Item[] = [];

  constructor(private elementRef: ElementRef) {
    super();
  }

  ngDoCheck() {
    if (this.container && this.items && this.container.getItems() !== this.items) {
      this.mapSlots();
    }
  }

  ngAfterViewInit() {
    if (!this.container) {
      setTimeout(this.calculate.bind(this));
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.calculate();
  }

  calculate() {
    this.items = this.visibleItems = new Array(this.slotCount);
    this.mapSlots();
  }

  mapSlots() {
    const items = this.container.getItems();
    const len = items.length;
    for (let i = 0; i < this.items.length; i++) {
      this.visibleItems[i] = i > len ? null : items[i];
    }
  }

  get slotCount() {
    const elm: Element = this.elementRef.nativeElement;
    const slotWidth = 38 + 5;
    const columns = (elm.clientWidth - 60) / slotWidth;
    const rows = Math.max(
      this.container.getItems().length / columns,
      (elm.clientHeight - 20) / slotWidth
    );
    return Math.ceil(columns) * Math.ceil(rows);
  }
}
