import {
  Input, Component, Output, EventEmitter, ViewChild, ElementRef,
  HostListener, DoCheck
} from '@angular/core';
import { Tab } from '../../classes/bank/tab';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'bank-tabs',
  templateUrl: 'bank-tabs.component.html',
  styleUrls: ['bank-tabs.component.css']
})
export class BankTabsComponent implements DoCheck {

  @Input()
  set tabs(tabs: Tab[]) {
    this._tabs = tabs;
    if (this._tabs.length > 0) {
      setTimeout(() => this.setActiveTab(this._tabs[0]));
    }
  }

  get tabs() {
    return this._tabs;
  }

  @Output()
  activeTabChange = new EventEmitter<Tab>();

  @Output()
  itemDrop = new EventEmitter<TabEvent>();

  @Input()
  activeTab: any;

  @Input()
  small: boolean;

  @ViewChild('listContainer')
  listContainer: ElementRef;

  pages: any[] = [true];
  private _tabs: Tab[];
  private timeout;
  private oldTabLength;
  active = null;
  mouseOverItem = null;

  ngDoCheck() {
    if (this._tabs.length !== this.oldTabLength) {
      this.calculate();
      this.oldTabLength = this._tabs.length;
    }
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.activeTabChange.emit(tab);
    this.calculate();
  }

  @HostListener('window:resize')
  onResize() {
    this.calculate();
  }

  onMouseEnter(item: Tab) {
    this.mouseOverItem = item;
  }

  onMouseLeave() {
    this.mouseOverItem = null;
  }

  onDragEnter(evt: DragEvent, tab) {
    evt.preventDefault();
    this.active = tab;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.active = false;
      this.setActiveTab(tab);
    }, 600);
    return false;
  }

  onDragOver(evt, tab) {
    evt.preventDefault();
  }

  onDrop(evt: DragEvent, tab: Tab) {
    evt.preventDefault();
    this.active = false;
    this.itemDrop.emit(this.createEvent(evt, tab));
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  jumpToPage(page: number) {
    this.setActiveTab(this._tabs[Math.min(this._tabs.length, page * this.pageSize)]);
  }

  movePage(dir: number) {
    const currentPage = this.pages.indexOf(true);
    if (dir < 0) {
      dir += this.pages.length;
    }
    this.jumpToPage((currentPage + dir) % this.pages.length);
  }

  move(dir: number) {
    let idx = this._tabs.indexOf(this.activeTab);
    if (idx === -1) {
      return;
    }
    if (dir < 0) {
      dir += this._tabs.length;
    }
    idx = (idx + dir) % this._tabs.length;
    this.setActiveTab(this._tabs[idx]);
  }

  get listElement(): HTMLElement {
    return this.listContainer.nativeElement;
  }

  get pageSize() {
    return Math.max(1, Math.floor(this.listElement.clientWidth / this.itemWidth));
  }

  get itemWidth() {
    return this.listElement.children[1].clientWidth - 5;
  }

  private calculate() {
    if (this.small) {
      return;
    }
    if (this.listElement.children.length === 0) {
      return;
    }
    const idx = this._tabs.indexOf(this.activeTab);
    const totalPages = Math.ceil(this._tabs.length / this.pageSize);
    if (this.pages.length === totalPages) {
      this.pages.fill(false);
    } else {
      this.pages = new Array(totalPages);
    }
    this.pages[Math.floor(idx / this.pageSize)] = true;
    this.listElement.scrollLeft = Math.max(0, (idx + 1) * this.itemWidth - (this.pageSize * this.itemWidth) / 2);
  }

  private createEvent(baseEvent, tab: any): TabEvent {
    return {
      altKey: baseEvent.altKey,
      ctrlKey: baseEvent.ctrlKey,
      shiftKey: baseEvent.shiftKey,
      metaKey: baseEvent.metaKey,
      tab
    };
  }
}

export interface TabEvent {
  tab: any;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}
