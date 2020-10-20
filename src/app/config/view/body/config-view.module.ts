import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from '../../../shared/shared.module';
import { MyMaterialModule } from '../../../material-module';

import { ConfigViewComponent } from './config-view.component';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      MyMaterialModule,
      ReactiveFormsModule
  ],
  declarations: [
      ConfigViewComponent
  ],
  bootstrap: [
      ConfigViewComponent
  ]
})
export class ConfigViewModule {}

