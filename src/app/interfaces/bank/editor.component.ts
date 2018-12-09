import { Component, OnInit } from '@angular/core';
import { Item } from '../../classes/item/item';
import { ItemDescriptor } from '../../classes/item/item-descriptor';
import { FormControl } from '@angular/forms';
import { PerkDescriptor } from '../../classes/item/invention/perk-descriptor';
import { Perk } from '../../classes/item/invention/perk';
import { Gizmo } from '../../classes/item/invention/gizmo';
import { Augmentor } from '../../classes/item/invention/augmentor';
import { DialogRef } from 'ngx-modialog';
import { ItemContainer } from '../../classes/item/item-container';
import { Bank } from '../../classes/bank/bank';
import { BankGenerator } from '../../classes/bank/bank-generator';
import { Player } from '../../classes/player';
import { JSONPlayerSave } from '../../classes/player-save/json-player-save';
import { EquipmentSlot } from '../../classes/equipment/equipment-slot';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Perks } from '../../classes/item/invention/perks';

@Component({
  templateUrl: 'editor.component.html',
  styleUrls: ['editor.component.css']
})
export class EditorComponent implements OnInit {

  searchFormControl = new FormControl();
  numberTabsFormControl = new FormControl();
  saveFormControl = new FormControl();
  numberItemsFormControl = new FormControl();
  xpFormControl = new FormControl();
  amountFormControl = new FormControl(1);
  augmentedFormControl = new FormControl(false);
  perkInputs = [
    { placeholder: 'Gizmo 1 perk 1', perkControl: new FormControl(), rankControl: new FormControl(), perk: null },
    { placeholder: 'Gizmo 1 perk 2', perkControl: new FormControl(), rankControl: new FormControl(), perk: null },
    { placeholder: 'Gizmo 2 perk 1', perkControl: new FormControl(), rankControl: new FormControl(), perk: null },
    { placeholder: 'Gizmo 2 perk 2', perkControl: new FormControl(), rankControl: new FormControl(), perk: null },
  ];
  results: ItemDescriptor[] = [];
  descriptor: ItemDescriptor;
  perks: PerkDescriptor[];
  tab = 0;
  status = '';

  constructor(private dialogRef: DialogRef<{ heading: string, bank: Bank, player: Player, container: ItemContainer, keyboard: any }>) {
    dialogRef.context.keyboard = null;
    dialogRef.context.keyboard = null;
    dialogRef.context.heading = 'Editor';
  }

  ngOnInit() {
    const data = localStorage.getItem('player');
    if (data) {
      this.saveFormControl.patchValue(data);
    }
    for (const input of this.perkInputs) {
      const bind = this.updateInput.bind(this, input);
      input.perkControl.valueChanges.subscribe(bind);
      input.rankControl.valueChanges.subscribe(bind);
    }
    this.perks = Object.keys(Perks).map((key) => Perks[key]);
    this.searchFormControl.valueChanges.pipe(debounceTime(600)).subscribe((term: string) => {
      term = term.toLowerCase();
      this.results = [];
      for (const desc of Item.descriptors) {
        if (desc.name.toLowerCase().indexOf(term) !== -1) {
          this.results.push(desc);
          if (this.results.length > 100) {
            break;
          }
        }
      }
    });
  }

  onResultClick(descriptor: ItemDescriptor) {
    this.descriptor = descriptor;
    const augmentableSlots = [EquipmentSlot.SHIELD, EquipmentSlot.MAIN, EquipmentSlot.BODY, EquipmentSlot.LEGS];
    if (descriptor.combatStats && augmentableSlots.indexOf(descriptor.combatStats.slot) !== -1) {
      this.augmentedFormControl.enable();
    } else {
      this.augmentedFormControl.patchValue(false);
      this.augmentedFormControl.disable();
    }
  }

  onAdd() {
    const item = new Item(this.descriptor);
    const gizmos = this.getGizmos();
    if (gizmos.length > 0) {
      item.augmentor = new Augmentor(gizmos);
      item.augmentor.xp = Number(this.xpFormControl.value);
    }
    this.dialogRef.context.container.add(item, Number(this.amountFormControl.value));
  }

  get icon() {
    return Item.iconLoader.getIconUrl(this.descriptor);
  }

  onRegenerate() {
    const generator = new BankGenerator();
    generator.tabCount = Number(this.numberTabsFormControl.value);
    generator.itemCount = Number(this.numberItemsFormControl.value);
    generator.regenerate(this.dialogRef.context.bank);
  }

  onSave() {
    const playerLoader = new JSONPlayerSave(this.dialogRef.context.player);
    const str = playerLoader.save();
    this.saveFormControl.patchValue(str);
    localStorage.setItem('player', str);
    this.status = 'Your bank has been saved to your browsers local storage.';
  }

  onLoad() {
    try {
      const playerLoader = new JSONPlayerSave(this.dialogRef.context.player);
      playerLoader.load(this.saveFormControl.value);
    } catch (e) {
      this.status = 'Error while loading: ' + e.message;
    }
  }

  private getGizmos() {
    const gizmos: [Gizmo, Gizmo] = [null, null];
    if (!this.augmentedFormControl.value) {
      return gizmos;
    }
    for (let i = 0; i < this.perkInputs.length; i++) {
      const input = this.perkInputs[i];
      if (input.perkControl.value) {
        const gizmoId = Math.floor(i / 2);
        const gizmo = gizmos[gizmoId];
        if (gizmo) {
          gizmo.perks[1] = input.perk;
        } else {
          gizmos[gizmoId] = new Gizmo(input.perk, null);
        }
      }
    }
    return gizmos;
  }

  private updateInput(input) {
    if (input.perkControl.value && input.rankControl.value > 0) {
      try {
        input.perk = new Perk(input.perkControl.value, input.rankControl.value);
      } catch (e) {
        /* ignore */
      }
    } else {
      input.perk = null;
    }
  }
}
