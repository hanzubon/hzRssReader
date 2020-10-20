import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MyMaterialModule } from '../../material-module';

import { ListMenuComponent } from './list-menu.component';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      RouterModule,
      MyMaterialModule
  ],
  declarations: [
      ListMenuComponent
  ],
  bootstrap: [
      ListMenuComponent
  ]
})
export class ListMenuModule {}

