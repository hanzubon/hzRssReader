import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ConfigFeedsComponent } from './config-feeds.component';
import { FeedUnsubscribeDialogComponent } from './feed-unsubscribe-dialog/feed-unsubscribe-dialog.component';
import { FeedUnsubscriberComponent } from './feed-unsubscriber/feed-unsubscriber.component';
import { FeedEditDialogComponent } from './feed-edit-dialog/feed-edit-dialog.component';
import { FeedEditorComponent } from './feed-editor/feed-editor.component';
import { CategoryDeleteDialogComponent } from './category-delete-dialog/category-delete-dialog.component';
import { CategoryDeleterComponent } from './category-deleter/category-deleter.component';
import { CategoryEditDialogComponent } from './category-edit-dialog/category-edit-dialog.component';
import { CategoryEditorComponent } from './category-editor/category-editor.component';
import { MyMaterialModule } from '../../../material-module';

@NgModule({
    imports: [
	CommonModule,
	SharedModule,
	RouterModule,
	FormsModule,
	ReactiveFormsModule,
	MyMaterialModule
    ],
    declarations: [
	ConfigFeedsComponent,
	FeedUnsubscribeDialogComponent,
	FeedUnsubscriberComponent,
	FeedEditDialogComponent,
	FeedEditorComponent,
	CategoryDeleteDialogComponent,
	CategoryDeleterComponent,
	CategoryEditDialogComponent,
	CategoryEditorComponent
    ],
    entryComponents: [
	FeedUnsubscribeDialogComponent,
	FeedEditDialogComponent,
	CategoryDeleteDialogComponent,
	CategoryEditDialogComponent
    ],
    bootstrap: [
	ConfigFeedsComponent
    ]
})
export class ConfigFeedsModule {}

