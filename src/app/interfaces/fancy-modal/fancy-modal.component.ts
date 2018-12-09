import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { DialogRef } from 'ngx-modialog';

@Component({
  selector: 'fancy-modal',
  templateUrl: 'fancy-modal.component.html',
  styleUrls: ['fancy-modal.component.css']
})
export class FancyModalComponent {

  @ViewChild('frame', { read: ElementRef })
  frame: ElementRef;

  @Input()
  heading: string;

  style: any = {
    position: 'fixed',
    left: undefined,
    top: undefined,
    width: undefined,
    height: undefined
  };

  constructor(public dialogRef: DialogRef<any>) {

  }

  onResizeEnd(event: ResizeEvent): void {
    this.style.left = `${event.rectangle.left}px`;
    this.style.top = `${event.rectangle.top}px`;
    this.style.width = `${event.rectangle.width}px`;
    this.style.height = `${event.rectangle.height}px`;
  }

  onClose() {
    this.dialogRef.dismiss();
  }

}
