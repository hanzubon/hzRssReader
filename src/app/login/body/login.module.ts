import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MyMaterialModule } from '../../material-module';

import { LoginComponent } from './login.component';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      MyMaterialModule
  ],
  declarations: [
      LoginComponent
  ],
  bootstrap: [
      LoginComponent
  ]
})
export class LoginModule {}
