import {
  Input,
  Component,
  HostListener,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
  OnDestroy,
  OnInit,
  ElementRef, AfterViewInit
} from '@angular/core';
import { Item } from '../../classes/item/item';
import { Player } from '../../classes/player';
import { BankTab } from '../../classes/bank/bank-tab';
import { ItemContainer } from '../../classes/item/item-container';
import { ItemEvent } from '../item/item-container.component';
import { Tab } from '../../classes/bank/tab';
import { TabEvent } from './bank-tabs.component';
import { Spells, SpellBook } from '../../classes/spells';
import { FormControl } from '@angular/forms';
import { HelpComponent } from './help.component';
import { EquipmentSlot } from '../../classes/equipment/equipment-slot';
import { SearchItemContainer } from '../../classes/bank/search-item-container';
import { ModalService } from '../../services/modal.service';
import { EditorComponent } from './editor.component';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { PrayerBook } from '../../classes/prayers';

@Component({
  selector: 'interface-bank',
  templateUrl: 'bank.component.html',
  styleUrls: ['bank.component.css']
})
export class BankComponent implements OnDestroy, OnInit, AfterViewInit {

  private static SEARCH_DEBOUNCE = 600;
  private static INPUT_DEBOUNCE = 300;
  private static TRANSFER_ALL = -1;
  private static TRANSFER_ALL_ONE = -2;
  private static TRANSFER_X = -3;

  @Input('player-model')
  set player(player: Player) {
    this._player = player;
    this.activeTab = player.bank.tabs[0];
    this.targetContainer = player.inventory;
  }

  get player() {
    return this._player;
  }

  @ViewChild('searchInput')
  searchInputElement: ElementRef;

  @ViewChild('frame', { read: ElementRef })
  frameElement: ElementRef;

  scrollbarOptions;
  otherTabArray: Tab[];
  activeTab: BankTab;
  targetContainer: ItemContainer;
  mouseOverItem: Item;
  mouseOverSlot: number;
  mouseOverContainer: ItemContainer;
  mouseOverSpell: any;
  searchFormControl: FormControl;
  searchContainer: ItemContainer;
  spellBooks = [
    { id: SpellBook.STANDARD, label: 'Normal spellbook' },
    { id: SpellBook.ANCIENT, label: 'Ancient spellbook' },
    { id: SpellBook.LUNAR, label: 'Lunar spellbook' }
  ];
  prayers = [
    { id: PrayerBook.NORMAL, label: 'Normal prayers' },
    { id: PrayerBook.CURSES, label: 'Cursed prayers' }
  ];
  filterBy = [
    { slot: EquipmentSlot.CAPE, label: 'Slot - Cape' },
    { slot: EquipmentSlot.HEAD, label: 'Slot - Head' },
    { slot: EquipmentSlot.LEGS, label: 'Slot - Legs' },
    { slot: EquipmentSlot.BODY, label: 'Slot - Body' },
    { slot: EquipmentSlot.NECK, label: 'Slot - Neck' },
    { slot: EquipmentSlot.FEET, label: 'Slot - Feet' },
    { slot: EquipmentSlot.MAIN, label: 'Slot - Main' },
    { slot: EquipmentSlot.HANDS, label: 'Slot - Hands' },
    { slot: EquipmentSlot.RING, label: 'Slot - Ring' },
    { slot: EquipmentSlot.SHIELD, label: 'Slot - Shield' },
    { slot: EquipmentSlot.AMMO, label: 'Slot - Ammo' },
    { slot: EquipmentSlot.POCKET, label: 'Slot - Pocket' },
    { slot: EquipmentSlot.AURA, label: 'Slot - Aura' },
    { slot: EquipmentSlot.SIGIL, label: 'Slot - Sigil' }
  ];
  sortBy = [
    { id: 0, label: 'No sorting :(' }
  ];
  spellbookFormControl = new FormControl(this.spellBooks[0]);
  prayerFormControl = new FormControl(this.prayers[0]);
  filterByFormControl = new FormControl();
  sortByFormControl = new FormControl();

  get tabs() {
    return this.player.bank.tabs;
  }

  set activePlayerTab(tab: Tab) {
    this._activePlayerTab = tab;
    this.targetContainer = tab.data.getContainer && tab.data.getContainer();
  }

  get activePlayerTab() {
    return this._activePlayerTab;
  }

  get bank() {
    return this._player.bank;
  }

  get spells() {
    return Spells.ALL;
  }

  private _activePlayerTab: Tab;
  private _player: Player;
  private event: KeyboardEvent | DragEvent = new KeyboardEvent('', null);
  private input: string;
  private inputTimeout: any;
  private drag: { from: ItemContainer, object: Item, slot: number };

  eventListener = (evt: DragEvent) => {
    if (evt.ctrlKey !== this.event.ctrlKey) {
      this.event = evt;
      this.cd.detectChanges();
    }
  }

  constructor(private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    private modalService: ModalService) {
    this.input = '';
    this.searchFormControl = new FormControl();
    this.scrollbarOptions = {
      alwaysShowScrollbar: 2,
      scrollInertia: 0,
      scrollButtons: { enable: true },
      mouseWheel: {
        scrollAmount: 45
      }
    };
    this.otherTabArray = [
      {
        icon: '../../../assets/img/interface/backpack_icon.png',
        data: {
          name: 'inventory',
          getContainer: () => this.player.inventory,
        }
      },
      {
        icon: '../../../assets/img/interface/equipment_icon.png',
        data: {
          name: 'equipment',
          getContainer: () => this.player.equipment,
        }
      },
      {
        icon: '../../../assets/img/interface/familiar_icon.png',
        data: {
          name: 'familiar',
          getContainer: () => this.player.familiar,
        }
      },
      {
        icon: 'https://vignette.wikia.nocookie.net/runescape2/images' +
          '/7/77/Magic-icon.png/revision/latest/scale-to-width-down/21?cb=20120122182526',
        data: {
          name: 'spellbook'
        }
      }
    ];
    this._activePlayerTab = this.otherTabArray[0];
  }

  ngOnInit() {
    const updateSearch = this.updateSearch.bind(this);
    this.searchFormControl.valueChanges.pipe(debounceTime(BankComponent.SEARCH_DEBOUNCE)).subscribe(updateSearch);
    this.filterByFormControl.valueChanges.subscribe(updateSearch);
    this.ngZone.runOutsideAngular(window.addEventListener.bind(window, 'dragover', this.eventListener));
  }

  ngAfterViewInit() {
    setTimeout(() => !localStorage.getItem('seen_help') && this.modalService.open(HelpComponent));
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(window.removeEventListener.bind(window, 'dragover', this.eventListener));
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.event = event;
    if (event.key === 'Tab') {
      event.preventDefault();
      this.switchPlayerTab(event.shiftKey ? -1 : 1);
      return false;
    } else if (event.key === 'F1') {
      event.preventDefault();
      return false;
    }
    if (this.searchFormControl.value &&
      this.searchInputElement.nativeElement === document.activeElement) {
      return;
    }
    const item = this.mouseOverItem;
    if (this.mouseOverContainer && item) {
      if (event.key === '-') {
        this.quickExchange(item, -1);
        return false;
      } else if (event.key === '+') {
        this.quickExchange(item, 1);
        return false;
      } else if (Number(event.key) >= 0) {
        if (this.inputTimeout) {
          clearTimeout(this.inputTimeout);
        } else if (this.inputTimeout === false) {
          this.input = '';
        }
        this.input += event.key;
        this.inputTimeout = setTimeout(() => this.inputTimeout = false, BankComponent.INPUT_DEBOUNCE);
        return false;
      }
    }
    this.searchInputElement.nativeElement.focus();
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.event = event;
    if (event.key === 'Escape') {
      if (!this.searchFormControl.value) {
        this.searchInputElement.nativeElement.blur();
      }
      if (this.searchFormControl.value) {
        this.searchFormControl.patchValue('');
      }
      if (this.filterByFormControl.value) {
        this.searchFormControl.patchValue(null);
      }
      this.input = '';
      return;
    } else if (event.key === 'Delete') {
      if (this.mouseOverItem && this.mouseOverContainer instanceof BankTab) {
        (<BankTab>this.mouseOverContainer).deleteItemSlot(this.mouseOverSlot);
      }
    } else if (event.key === 'Backspace') {
      this.depositAll(this.targetContainer);
    } else if (event.key === 'F1') {
      this.modalService.open(HelpComponent);
    } else if (event.key === 'F2') {
      const dialogRef = this.modalService.open(EditorComponent);
      dialogRef.context.container = this.activeTab;
      dialogRef.context.bank = this.bank;
      dialogRef.context.player = this.player;
    }
    return false;
  }

  quickExchange(item: Item, amount: number) {
    if (this.mouseOverContainer instanceof BankTab || this.mouseOverContainer instanceof SearchItemContainer) {
      if (amount === -1) {
        this.deposit(this.targetContainer.findItemType(item), 1);
      } else if (amount === 1) {
        this.withdraw(item);
      } else if (amount >= 0) {
        this.withdraw(item, amount);
      }
    } else {
      if (amount === -1) {
        this.deposit(item, 1);
      } else if (amount === 1) {
        this.withdraw(item, 1);
      } else if (amount >= 0) {
        this.deposit(item, amount);
      }
    }
  }

  switchPlayerTab(dir: number) {
    const currentTabIdx = this.otherTabArray.findIndex((t) => t.data === this.activePlayerTab.data);
    if (dir < 0) {
      dir += this.otherTabArray.length;
    }
    this.activePlayerTab = this.otherTabArray[(currentTabIdx + dir) % this.otherTabArray.length];
  }

  onDropToTab(evt: TabEvent) {
    const from = this.drag.from as BankTab;
    if (evt.ctrlKey) {
      from.copyItemSlot(this.drag.slot, undefined, evt.tab);
    } else {
      from.moveItemSlot(this.drag.slot, undefined, evt.tab);
    }
    this.drag = null;
    this.mouseOverItem = null;
  }

  onDropToPlayerTab(evt: TabEvent) {
    this.dragTo(evt.tab.data.getContainer());
  }

  onItemDrop(evt: ItemEvent, to: ItemContainer) {
    if (evt.ctrlKey && this.drag.from === to && to instanceof BankTab) {
      to.copyItemSlot(this.drag.slot, evt.slot, to);
    } else {
      this.dragTo(to, evt.slot);
    }
  }

  onMouseOverItem(evt: ItemEvent, container: ItemContainer) {
    this.mouseOverItem = evt.object;
    this.mouseOverSlot = evt.slot;
    this.mouseOverContainer = container;
  }

  onMouseOverSpell(evt: any) {
    this.mouseOverSpell = evt;
  }

  onSpellWithdraw(spell: any) {
    if (!this.bank.hasEnoughOf(spell.runes)) {
      return alert('Not enough runes in your bank');
    }
    for (const rune of spell.runes) {
      this.activeTab.transfer(this.bank.findItemType(rune), rune.amount * this.bank.runeWithdrawalMultiplier, this.player.inventory);
    }
  }

  dragTo(to: ItemContainer, toSlot?: number) {
    this.drag.from.transfer(this.drag.object, this.drag.object.amount, to, this.drag.slot, toSlot);
    this.drag = null;
  }

  onItemDragStart(evt: ItemEvent, from: ItemContainer) {
    this.drag = {
      from: from,
      object: evt.object,
      slot: evt.slot
    };
  }

  onItemDragEnd(evt: ItemEvent) {
    this.drag = null;
  }

  onWithdraw(evt: ItemEvent) {
    if (evt.object === null) {
      return;
    }
    if (evt.altKey) {
      this.deposit(this.targetContainer.findItemType(evt.object), 1);
    } else {
      this.withdraw(evt.object);
    }
  }

  onDeposit(evt: ItemEvent) {
    if (evt.ctrlKey) {
      if (this.mouseOverContainer === this.player.equipment) {
        this.filterBySlot(evt.slot);
      }
    } else if (evt.altKey) {
      this.withdraw(this.bank.findItemType(evt.object));
    } else {
      this.deposit(evt.object, undefined, evt.slot);
    }
  }

  onAddTab() {
    this.bank.addTab();
  }

  onRemoveTab(tab: BankTab) {
    const pos = this.bank.tabs.indexOf(tab);
    if (pos > 0) {
      this.bank.removeTab(tab);
      if (this.activeTab === tab) {
        this.activeTab = this.player.bank.tabs[pos - 1];
      }
    }
  }

  removePlaceholder(item: Item, slot?: number) {
    this.activeTab.deleteItemSlot(slot);
  }

  withdraw(item: Item, amount?: number) {
    this.transfer(item, amount, this.activeTab, this.targetContainer);
  }

  deposit(item: Item, amount?: number, slot?: number) {
    if (!this.activeTab.findItemType(item)) {
      this.activeTab = this.bank.findItemTab(item) || this.activeTab;
    }
    this.transfer(item, amount, this.targetContainer, this.activeTab, slot);
  }

  depositAll(container: ItemContainer) {
    container.transferAll(this.bank);
    return false;
  }

  transfer(item: Item, amount: number, fromContainer: ItemContainer, toContainer: ItemContainer, slot?: number) {
    if (item === null) {
      return 0;
    }
    if (amount === undefined) {
      amount = Number(this.input);
      if (amount <= 0) {
        amount = 1;
      }
    } else if (amount === BankComponent.TRANSFER_ALL_ONE) {
      amount = fromContainer.count(item) - 1;
    } else if (amount === BankComponent.TRANSFER_ALL || this.event.shiftKey) {
      amount = fromContainer.count(item);
    } else if (amount === BankComponent.TRANSFER_X) {
      amount = Number(prompt('Enter amount'));
    }
    if (amount > 0 && item.amount > 0) {
      return fromContainer.transfer(item, amount, toContainer, slot);
    }
    return 0;
  }

  bankOptionClicked(item: Item, option) {
    if (option.name === 'Wear') {
      this.bank.transfer(item, item.amount, this.player.equipment);
    }
  }

  inventoryOptionClicked(item: Item, option) {
    if (option.name === 'Wear') {
      const added = this.player.equipment.equip(item.clone(), item.amount, this.player.inventory);
      this.player.inventory.remove(item, added);
    }
  }

  toggleSlot(slot: number) {
    this.targetContainer.toggleSlot(slot);
  }

  filterBySlot(slot: number) {
    this.filterByFormControl.patchValue(this.filterBy.find((filter) => filter.slot === slot));
  }

  updateSearch() {
    if (!this.searchFormControl.value && !this.filterByFormControl.value) {
      this.searchContainer = null;
      return;
    }
    if (!this.searchContainer) {
      this.searchContainer = new SearchItemContainer();
    }
    this.searchContainer.setItems(this.bank.getItems().filter((item) =>
      item &&
      (this.searchFormControl.value && item.name.toLowerCase().indexOf(this.searchFormControl.value.toLowerCase()) !== -1) ||
      (this.filterByFormControl.value && item.combatStats && item.combatStats.slot === this.filterByFormControl.value.slot)
    ));
  }

  get action() {
    let amt = '';
    if (Number(this.input) > 0) {
      amt = '-' + this.input;
    }
    if (this.event.shiftKey) {
      amt = '-ALL';
    }
    let altKey = this.event.altKey;
    if (this.targetContainer === this.player.equipment && this.mouseOverItem.combatStats) {
      const slot = this.mouseOverItem.combatStats.slot;
      let action;
      if ((this.mouseOverContainer === this.player.equipment) !== altKey) {
        action = 'Remove to bank';
      } else if (slot === EquipmentSlot.MAIN || slot === EquipmentSlot.SHIELD) {
        action = 'Wield';
      } else if (slot === EquipmentSlot.POCKET) {
        action = 'Put in pocket';
      } else {
        action = 'Wear';
      }
      return action + amt;
    } else if (this.drag) {
      return this.event.ctrlKey ? 'Clone' : 'Move';
    } else if (this.mouseOverContainer === this.player.inventory) {
      altKey = !altKey;
    }
    if (altKey) {
      return 'Deposit' + amt;
    }
    return 'Withdraw' + amt;
  }

  nip() {
    alert('Not implemented');
  }

}
