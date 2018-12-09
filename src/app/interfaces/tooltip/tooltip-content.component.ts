import { Component, ElementRef, ChangeDetectionStrategy, NgZone, OnDestroy, Input } from '@angular/core';
import { FloatingBoxComponent } from '../floating-box/floating-box.component';

@Component({
  selector: 'tooltip-content',
  templateUrl: '../floating-box/floating-box.component.html',
  styleUrls: [
    '../floating-box/floating-box.component.css',
    'tooltip-content.component.css'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent extends FloatingBoxComponent implements OnDestroy {

  private static PADDING = 25;

  @Input()
  set context(context: any) {
    this._context.$implicit = context;
    if (context) {
      this.attach();
    } else {
      this.detach();
    }
    this.elementRef.nativeElement.classList.toggle('hidden', !context);
  }

  listener = (evt: MouseEvent) => this.move(evt.pageX + TooltipComponent.PADDING, evt.pageY + TooltipComponent.PADDING);

  constructor(elementRef: ElementRef, private zone: NgZone) {
    super(elementRef);
    document.body.appendChild(elementRef.nativeElement);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.detach();
  }

  attach() {
    this.zone.runOutsideAngular(() => {
      window.document.addEventListener('mousemove', this.listener);
      window.document.addEventListener('dragover', this.listener);
    });
  }

  detach() {
    this.zone.runOutsideAngular(() => {
      window.document.removeEventListener('mousemove', this.listener);
      window.document.removeEventListener('dragover', this.listener);
    });
  }

  move(x: number, y: number) {
    const elm = this.elementRef.nativeElement;
    const wWidth = elm.offsetWidth + x - document.documentElement.clientWidth;
    const wHeight = elm.offsetHeight + y - document.documentElement.clientHeight;
    if (wWidth > 0) {
      x -= wWidth;
    }
    if (wHeight > 0) {
      y -= elm.clientHeight + 40;
    }
    elm.style.left = x + 'px';
    elm.style.top = y + 'px';
  }

}
