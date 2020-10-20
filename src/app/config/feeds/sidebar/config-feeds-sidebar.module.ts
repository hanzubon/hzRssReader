import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

import { ConfigFeedsSidebarComponent } from './config-feeds-sidebar.component';
import { MyMaterialModule } from '../../../material-module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      RouterModule,
      MyMaterialModule
  ],
  declarations: [
      ConfigFeedsSidebarComponent
  ],
  bootstrap: [
      ConfigFeedsSidebarComponent
  ]
})
export class ConfigFeedsSidebarModule {}

