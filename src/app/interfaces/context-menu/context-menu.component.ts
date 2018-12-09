import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener,
  TemplateRef
} from '@angular/core';
import { FloatingBoxComponent } from '../floating-box/floating-box.component';

@Component({
  selector: 'context-menu',
  templateUrl: '../floating-box/floating-box.component.html',
  styleUrls: ['context-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent extends FloatingBoxComponent {

  constructor(elementRef: ElementRef, private cd: ChangeDetectorRef) {
    super(elementRef);
  }

  show(content: TemplateRef<any>, context: any, x: number = 0, y: number = 0) {
    this.templateRef = content;
    this.context = context;
    this.move(x - (this.elementRef.nativeElement.clientWidth / 2), y);
    setTimeout(() => {
      this.cd.detectChanges();
      this.move(x - (this.elementRef.nativeElement.clientWidth / 2), y);
    });
  }

  hide() {
    this.context = null;
  }

  @HostListener('document:click')
  @HostListener('document:keypress')
  @HostListener('mouseleave')
  onMouseLeave() {
    this.hide();
  }

}
