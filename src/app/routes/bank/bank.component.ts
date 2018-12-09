import { Component, OnInit, HostListener } from '@angular/core';
import { Player } from '../../classes/player';
import { BankGenerator } from '../../classes/bank/bank-generator';
import { JSONPlayerSave } from '../../classes/player-save/json-player-save';

@Component({
  selector: 'bank-container',
  templateUrl: 'bank.component.html'
})
export class BankComponent implements OnInit {

  player: Player;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'F10') {
      const save = new JSONPlayerSave(this.player);
      save.save();
    }
  }

  ngOnInit() {
    const player = new Player();
    const playerData = localStorage.getItem('player');
    if (playerData) {
      const save = new JSONPlayerSave(player);
      save.load(playerData);
    } else {
      const generator = new BankGenerator();
      generator.tabCount = 5;
      generator.itemCount = 100;
      generator.regenerate(player.bank);
    }
    this.player = player;
  }

}
