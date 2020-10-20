import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { MyMaterialModule } from '../../../material-module';

import { NgxfUploaderModule } from 'ngxf-uploader';

import { ConfigFeedsMenuComponent } from './config-feeds-menu.component'
import { OpmlUploadDialogComponent } from './opml-upload-dialog/opml-upload-dialog.component'
import { OpmlUploaderComponent } from './opml-uploader/opml-uploader.component'

@NgModule({
    imports: [
	CommonModule,
	SharedModule,
	MyMaterialModule,
	NgxfUploaderModule
    ],
    declarations: [
	ConfigFeedsMenuComponent,
	OpmlUploadDialogComponent,
	OpmlUploaderComponent
    ],
    entryComponents: [
	OpmlUploadDialogComponent
    ],
    bootstrap: [
	ConfigFeedsMenuComponent
    ]
})
export class ConfigFeedsMenuModule {}

