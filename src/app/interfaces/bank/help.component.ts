import { Component } from '@angular/core';
import { DialogRef } from 'ngx-modialog';

@Component({
  templateUrl: 'help.component.html',
  styleUrls: ['help.component.css']
})
export class HelpComponent {

  constructor(private dialog: DialogRef<any>) {
    dialog.context.heading = 'Help';
    localStorage.setItem('seen_help', '1');
  }

}
