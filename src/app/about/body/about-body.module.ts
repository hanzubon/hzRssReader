import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MyMaterialModule } from '../../material-module';

import { AboutBodyComponent } from './about-body.component';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      MyMaterialModule
  ],
  declarations: [
      AboutBodyComponent
  ],
  bootstrap: [
      AboutBodyComponent
  ]
})
export class AboutBodyModule {}

