import {
  Component, Input
} from '@angular/core';
import { Perk } from '../../classes/item/invention/perk';

@Component({
  selector: 'item-perk',
  templateUrl: 'item-perk.component.html',
  styleUrls: [
    'item-perk.component.css'
  ]
})
export class ItemPerkComponent {

  @Input()
  perk: Perk;

  rankToArray(rank: number) {
    return new Array(rank);
  }

}
