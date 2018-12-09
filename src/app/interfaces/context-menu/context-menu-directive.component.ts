import { Directive, HostListener, Input, TemplateRef } from '@angular/core';
import { ContextMenuService } from './context-menu.service';

@Directive({
  selector: '[context]'
})
export class ContextMenuDirective {

  @Input()
  context: any;

  @Input()
  contextContent: TemplateRef<any>;

  constructor(private contextMenuService: ContextMenuService) {
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(evt: MouseEvent) {
    this.contextMenuService.show(this.contextContent, this.context, evt.pageX, evt.pageY);
    return false;
  }

}
