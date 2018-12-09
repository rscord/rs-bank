import {
  Component, Input
} from '@angular/core';
import { Item } from '../../classes/item/item';

@Component({
  selector: 'item-stats',
  templateUrl: 'item-stats.component.html',
  styleUrls: [
    'item-stats.component.css'
  ]
})
export class ItemStatsComponent {

  @Input()
  item: Item;

}
