import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { MyMaterialModule } from '../../material-module';

import { ListComponent } from './list.component';
import { ListHeadComponent } from './head/head.component';
import { ListItemComponent } from './item/item.component';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      VirtualScrollerModule,
      MyMaterialModule,
      FormsModule
  ],
  declarations: [
      ListComponent,
      ListHeadComponent,
      ListItemComponent
  ],
  bootstrap: [
      ListComponent
  ]
})
export class ListModule {}

