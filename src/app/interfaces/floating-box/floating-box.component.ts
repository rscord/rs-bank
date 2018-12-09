import {
  Component, Input, ElementRef, ContentChild, TemplateRef, ChangeDetectionStrategy, OnDestroy
} from '@angular/core';

@Component({
  selector: 'floating-box',
  templateUrl: 'floating-box.component.html',
  styleUrls: ['../context-menu/context-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloatingBoxComponent implements OnDestroy {

  @ContentChild(TemplateRef)
  templateRef: TemplateRef<any>;

  _context = {
    $implicit: null
  };

  @Input()
  set context(context: any) {
    this._context.$implicit = context;
    this.elementRef.nativeElement.classList.toggle('hidden', !context);
  }

  get context() {
    return this._context.$implicit;
  }

  constructor(protected elementRef: ElementRef) {
    document.body.appendChild(elementRef.nativeElement);
  }

  ngOnDestroy() {
    document.body.removeChild(this.elementRef.nativeElement);
  }

  move(x: number, y: number) {
    const elm = this.elementRef.nativeElement;
    const wWidth = elm.offsetWidth + x - document.documentElement.clientWidth;
    const wHeight = elm.offsetHeight + y - document.documentElement.clientHeight;
    if (wWidth > 0) {
      x -= wWidth;
    }
    if (wHeight > 0) {
      y -= wHeight;
    }
    elm.style.left = x + 'px';
    elm.style.top = y + 'px';
  }

}
