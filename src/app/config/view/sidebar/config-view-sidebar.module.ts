import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

import { ConfigViewSidebarComponent } from './config-view-sidebar.component';
import { MyMaterialModule } from '../../../material-module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      RouterModule,
      MyMaterialModule
  ],
  declarations: [
      ConfigViewSidebarComponent
  ]
})
export class ConfigViewSidebarModule {}

