import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ListRedirectComponent } from './list-redirect.component';

@NgModule({
  imports: [
      CommonModule,
      SharedModule
  ],
  declarations: [
      ListRedirectComponent
  ],
  bootstrap: [
      ListRedirectComponent
  ]
})
export class ListRedirectModule {}

