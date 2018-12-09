import {
  Input, Component, Output, EventEmitter
} from '@angular/core';
import { ItemContainer } from '../../classes/item/item-container';

@Component({
  selector: 'spellbook',
  templateUrl: 'spellbook.component.html',
  styleUrls: ['spellbook.component.css']
})
export class SpellbookComponent {

  @Input()
  spells: any[];

  @Input()
  runeContainer: ItemContainer;

  @Output()
  itemOver = new EventEmitter();

  @Output()
  itemClick = new EventEmitter();

  categories = [
    {
      id: 'COMBAT',
      name: 'Combat',
      icon: 'https://runescape.wiki/images/7/79/Fire_Surge_icon.png'
    },
    {
      id: 'TELEPORT',
      name: 'Teleports',
      icon: 'https://runescape.wiki/images/1/13/Home_Teleport_icon.png'
    },
    {
      id: 'SKILLING',
      name: 'Skilling',
      icon: 'https://runescape.wiki/images/c/c0/High_Level_Alchemy_icon.png'
    }
  ];
  activeCategory = this.categories[0];
  scrollbarOptions = {
    scrollInertia: 0
  };

  onMouseEnter(spell) {
    this.itemOver.emit(spell);
  }

  onMouseClick(spell) {
    this.itemClick.emit(spell);
  }

  onMouseLeave(spell) {
    this.itemOver.emit(null);
  }

  canCast(spell) {
    return this.runeContainer && this.runeContainer.hasEnoughOf(spell.runes);
  }
}
