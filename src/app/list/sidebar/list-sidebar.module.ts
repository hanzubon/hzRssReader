import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { ListSidebarComponent } from './list-sidebar.component';
import { FolderIconComponent } from './folder-icon/folder-icon.component';
import { FeedListComponent } from './feed-list/feed-list.component';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';

import { MyMaterialModule } from '../../material-module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      RouterModule,
      MyMaterialModule
  ],
  declarations: [
      ListSidebarComponent,
      FolderIconComponent,
      FeedListComponent,
      SidebarItemComponent
  ],
  bootstrap: [
      ListSidebarComponent
  ]
})
export class ListSidebarModule {}
