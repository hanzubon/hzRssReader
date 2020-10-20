import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { AboutSidebarComponent } from './about-sidebar.component';
import { MyMaterialModule } from '../../material-module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      RouterModule,
      MyMaterialModule
  ],
  declarations: [
      AboutSidebarComponent
  ]
})
export class AboutSidebarModule {}
