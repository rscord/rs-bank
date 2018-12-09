import { Player } from '../player';
import { JsonItemTransformer } from './json-item-transformer';
import { BankTab } from '../bank/bank-tab';

export class JSONPlayerSave {

  constructor(private player: Player) {

  }

  load(json: string) {
    const data = JSON.parse(json);
    const jsonItemTransformer = new JsonItemTransformer();
    const items = data.bank.items.map(jsonItemTransformer.from);
    this.player.bank.runeWithdrawalMultiplier = data.bank.runeWithdrawalMultiplier;
    this.player.bank.setItems(items);
    this.player.bank.tabs = data.bank.tabs.map((dataTab) => {
      const tabItems = dataTab.items.map((idx) => items[idx]);
      const tab = new BankTab(this.player.bank, tabItems);
      tab.name = dataTab.name;
      tab.color = dataTab.color;
      tab.customIcon = dataTab.icon;
      tab.keybind = dataTab.keybind;
      return tab;
    });
    this.player.inventory.setItems(data.inventory.items.map(jsonItemTransformer.from));
    this.player.equipment.setItems(data.equipment.items.map(jsonItemTransformer.from));
    this.player.familiar.setItems(data.familiar.items.map(jsonItemTransformer.from));
    this.player.inventory.lockedSlots = data.inventory.lockedSlots;
  }

  save() {
    const jsonItemTransformer = new JsonItemTransformer();
    const bankItems = this.player.bank.getItems().filter((i) => !!i);
    const data: any = {
      bank: {
        runeWithdrawalMultiplier: this.player.bank.runeWithdrawalMultiplier,
        items: bankItems.map(jsonItemTransformer.to),
        tabs: this.player.bank.tabs.map((tab) => ({
          name: tab.name,
          icon: tab.customIcon,
          color: tab.color,
          keybind: tab.keybind,
          items: tab.getItems().map(bankItems.indexOf.bind(bankItems))
        }))
      },
      inventory: {
        items: this.player.inventory.getItems().map(jsonItemTransformer.to),
        lockedSlots: this.player.inventory.lockedSlots
      },
      equipment: {
        items: this.player.equipment.getItems().map(jsonItemTransformer.to)
      },
      familiar: {
        items: this.player.familiar.getItems().map(jsonItemTransformer.to)
      }
    };
    return JSON.stringify(data);
  }

}
