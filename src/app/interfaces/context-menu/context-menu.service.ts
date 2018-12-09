import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, TemplateRef } from '@angular/core';
import { ContextMenuComponent } from './context-menu.component';

@Injectable()
export class ContextMenuService {

  private component: ComponentRef<ContextMenuComponent>;

  constructor(private appRef: ApplicationRef, private cfr: ComponentFactoryResolver, private injector: Injector) {
  }

  public show(content: TemplateRef<any>, context: any, x: number, y: number) {
    if (!this.component) {
      const factory = this.cfr.resolveComponentFactory(ContextMenuComponent);
      this.component = factory.create(this.injector);
      this.appRef.attachView(this.component.hostView);
    }
    this.component.instance.show(content, context, x, y);
  }

}
