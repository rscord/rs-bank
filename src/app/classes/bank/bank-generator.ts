import { Gizmo } from '../item/invention/gizmo';
import { Item } from '../item/item';
import { Perk } from '../item/invention/perk';
import { Utils } from '../utils';
import { Bank } from './bank';
import { Perks } from '../item/invention/perks';

export class BankGenerator {

  tabCount = 1;
  itemCount = 10;

  regenerate(bank: Bank) {
    const items = this.generateItems();
    bank.setItems(items);
    for (let i = 0; i < this.tabCount; i++) {
      const tab = bank.addTab();
      tab.color = Utils.getRandomColor();
    }
    for (const item of items) {
      const randomTab = bank.tabs[Math.floor(Math.random() * bank.tabs.length)];
      randomTab.addItemSlot(item);
    }
  }

  generateItems() {
    const items = new Array(Math.round(this.itemCount)).fill(0).map((v, i) => {
      const item = new Item(Item.descriptors[Math.floor(Math.random() * Item.descriptors.length)]);
      item.amount = 1;
      if (item.isStackable) {
        item.amount = Math.floor(Math.random() * 1000);
      } else if (item.isStackableInBank) {
        item.amount = Math.floor(Math.random() * 10);
      }
      return item;
    });
    items.push(Item.create('Air rune', 900000));
    items.push(Item.create('Fire rune', 9000));
    items.push(Item.create('Astral rune', 9000));
    items.push(Item.create('Blood rune', 9000));
    items.push(Item.create('Earth rune', 9000));
    items.push(Item.create('Mind rune', 9000));
    items.push(Item.create('Blurite ore', 900));
    items.push(Item.create('Runite ore', 3200));
    items.push(Item.create('Iron ore', 18000));
    items.push(Item.create('Coal', 8000));
    items.push(Item.create('Armadyl chaps', 1));
    items.push(Item.create('Armadyl chestplate', 1));
    items.push(Item.create('Rune knife', 100));
    items.push(Item.create('Noxious scythe', 1, {
      xp: 18848,
      gizmos: [
        new Gizmo(new Perk(Perks.AFTERSHOCK, 3), new Perk(Perks.BITING, 3)),
        new Gizmo(new Perk(Perks.PRECISE, 5), new Perk(Perks.EQUILIBRIUM, 3))
      ]
    }));
    // filter duplicates
    for (let i = 0; i < items.length; i++) {
      for (let i2 = i + 1; i2 < items.length; i2++) {
        if (items[i2] && items[i2].isCopyOf(items[i])) {
          items[i2] = null;
        }
      }
    }
    return items.filter((i) => i !== null);
  }

}
