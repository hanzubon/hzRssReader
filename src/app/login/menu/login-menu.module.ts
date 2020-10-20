import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginMenuComponent } from './login-menu.component';

@NgModule({
  imports: [
      CommonModule,
      SharedModule
  ],
  declarations: [
      LoginMenuComponent
  ],
  bootstrap: [
      LoginMenuComponent
  ]
})
export class LoginMenuModule {}
