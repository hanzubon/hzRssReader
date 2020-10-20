import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { ConfigViewMenuComponent } from './config-view-menu.component';

@NgModule({
  imports: [
      CommonModule,
      SharedModule
  ],
  declarations: [
      ConfigViewMenuComponent
  ],
  bootstrap: [
      ConfigViewMenuComponent
  ]
})
export class ConfigViewMenuModule {}

