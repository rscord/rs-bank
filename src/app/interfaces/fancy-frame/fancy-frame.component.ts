import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'fancy-frame',
  templateUrl: 'fancy-frame.component.html',
  styleUrls: ['fancy-frame.component.css']
})
export class FancyFrameComponent {

  @Input()
  heading: string;

  @Output()
  close = new EventEmitter();

  @ViewChild('head')
  head: ElementRef;

  onClose() {
    this.close.emit();
  }

}
