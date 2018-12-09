import { Injectable } from '@angular/core';
import { ContainerContent, DialogRef, Modal, Overlay } from 'ngx-modialog';
import { FancyModalComponent } from '../interfaces/fancy-modal/fancy-modal.component';

@Injectable()
export class ModalService extends Modal {

  constructor(overlay: Overlay) {
    super(overlay);
  }

  protected create(dialogRef: DialogRef<any>, content: ContainerContent): DialogRef<any> {
    const containerRef = this.createContainer(dialogRef, FancyModalComponent, content);
    const overlay = dialogRef.overlayRef.instance;
    dialogRef.inElement ? overlay.insideElement() : overlay.fullscreen();
    if (containerRef.location.nativeElement) {
      containerRef.location.nativeElement.focus();
    }
    return dialogRef;
  }

}
