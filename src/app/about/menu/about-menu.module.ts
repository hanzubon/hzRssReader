import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { AboutMenuComponent } from './about-menu.component';

@NgModule({
  imports: [
      CommonModule,
      SharedModule
  ],
  declarations: [
      AboutMenuComponent
  ],
  bootstrap: [
      AboutMenuComponent
  ]
})
export class AboutMenuModule {}

