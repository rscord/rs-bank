import { Component } from '@angular/core';
import { ItemContainerComponent } from '../item/item-container.component';
import { EquipmentSlot } from '../../classes/equipment/equipment-slot';

@Component({
  selector: 'equipment-container',
  templateUrl: 'equipment-container.component.html',
  styleUrls: [
    '../item/item-container.component.css',
    'equipment-container.component.css'
  ]
})
export class EquipmentContainerComponent extends ItemContainerComponent {

  equipmentSlots = Object.keys(EquipmentSlot)
    .filter((name) => isNaN(Number(name)))
    .map((name) => name.toLowerCase());

}
