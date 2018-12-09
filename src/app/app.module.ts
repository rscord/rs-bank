import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BankComponent as BankInterfaceComponent } from './interfaces/bank/bank.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { BankTabsComponent } from './interfaces/bank/bank-tabs.component';
import { HttpClientModule } from '@angular/common/http';
import { JustAFewPipe } from './pipes/just-a-few.pipe';
import { ItemContainerComponent } from './interfaces/item/item-container.component';
import { ContextMenuComponent } from './interfaces/context-menu/context-menu.component';
import { TooltipComponent } from './interfaces/tooltip/tooltip-content.component';
import { FloatingBoxComponent } from './interfaces/floating-box/floating-box.component';
import { ContextMenuDirective } from './interfaces/context-menu/context-menu-directive.component';
import { BankItemContainerComponent } from './interfaces/bank/bank-item-container.component';
import { EquipmentContainerComponent } from './interfaces/equipment/equipment-container.component';
import { FancyFrameComponent } from './interfaces/fancy-frame/fancy-frame.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { ItemStatsComponent } from './interfaces/item/item-stats.component';
import { BankComponent } from './routes/bank/bank.component';
import { PresetsComponent } from './interfaces/bank/presets.component';
import { ResizableModule } from 'angular-resizable-element';
import { ReactiveFormsModule } from '@angular/forms';
import { HelpComponent } from './interfaces/bank/help.component';
import { FancyModalComponent } from './interfaces/fancy-modal/fancy-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContextMenuService } from './interfaces/context-menu/context-menu.service';
import { EditorComponent } from './interfaces/bank/editor.component';
import { ItemPerkComponent } from './interfaces/item/item-perk.component';
import { ModalService } from './services/modal.service';
import { ModalModule } from 'ngx-modialog';
import { SpellbookComponent } from './interfaces/spellbook/spellbook.component';

@NgModule({
  declarations: [
    AppComponent,
    BankInterfaceComponent,
    BankTabsComponent,
    JustAFewPipe,
    ItemContainerComponent,
    ItemStatsComponent,
    FancyFrameComponent,
    BankItemContainerComponent,
    EquipmentContainerComponent,
    TooltipComponent,
    ContextMenuComponent,
    FloatingBoxComponent,
    ContextMenuDirective,
    SpellbookComponent,
    BankComponent,
    PresetsComponent,
    HelpComponent,
    EditorComponent,
    FancyModalComponent,
    ItemPerkComponent
  ],
  imports: [
    BrowserModule,
    MalihuScrollbarModule.forRoot(),
    HttpClientModule,
    AngularDraggableModule,
    ResizableModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    NgSelectModule
  ],
  providers: [ContextMenuService, ModalService],
  bootstrap: [AppComponent],
  entryComponents: [PresetsComponent, HelpComponent, ContextMenuComponent, EditorComponent, FancyModalComponent]
})
export class AppModule {
}
