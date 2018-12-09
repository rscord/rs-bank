import { Component, ElementRef, ViewChild } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { FancyFrameComponent } from '../fancy-frame/fancy-frame.component';

@Component({
  selector: 'presets',
  templateUrl: 'presets.component.html',
  styleUrls: ['presets.component.css']
})
export class PresetsComponent {


  @ViewChild('frame', { read: ElementRef })
  frame: ElementRef;

  style: any;

  onResizeEnd(event: ResizeEvent): void {
    this.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }

}
