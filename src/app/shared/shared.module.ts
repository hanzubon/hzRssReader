import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';
import { NoSidebarComponent } from './no-sidebar/no-sidebar.component';
import { WithSidebarComponent } from './with-sidebar/with-sidebar.component';
import { ConfigSidebarComponent } from './config-sidebar/config-sidebar.component';
import { SubscribeDialogComponent } from './subscribe-dialog/subscribe-dialog.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { FeedSubscriberComponent } from './feed-subscriber/feed-subscriber.component';
import { FeedSearcherComponent } from './feed-searcher/feed-searcher.component';
import { SettingService } from './setting/setting.service';
import { SideNavService } from './sidenav/sidenav.service';
import { swUpdateService } from './sw-update/sw-update.service'
import { ActionFeedbackService } from './action-feedback/action-feedback.service'
import { AboutComponent } from './about/about.component';
import { MyMaterialModule } from '../material-module';

@NgModule({
    declarations: [
	LoaderComponent,
	NoSidebarComponent,
	WithSidebarComponent,
	ConfigSidebarComponent,
	SubscribeDialogComponent,
	SearchDialogComponent,
	FeedSubscriberComponent,
	FeedSearcherComponent,
	AboutComponent
    ],
    providers: [
	SettingService,
	SideNavService,
	swUpdateService,
	ActionFeedbackService
    ],
    imports: [
	CommonModule,
	RouterModule,
	FormsModule,
	ReactiveFormsModule,
	MyMaterialModule
    ],
    entryComponents: [
	SubscribeDialogComponent,
	SearchDialogComponent
    ],
    exports: [
	LoaderComponent,
	ConfigSidebarComponent,
	FeedSubscriberComponent,
	FeedSearcherComponent,
	AboutComponent
    ]
})
export class SharedModule {}
