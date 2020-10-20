import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileError, NgxfUploaderService, UploadEvent, UploadStatus } from 'ngxf-uploader'

import { Store } from '@ngrx/store';
import { IAppState } from '../../../../store/index';
import { Observable, Subscription } from 'rxjs';

import { SettingService } from '../../../../shared/setting/setting.service'

import { GET_FEEDTREE } from '../../../../store/feedtree/feedtree.actions'

@Component({
    selector: 'app-opml-upload-dialog',
    templateUrl: './opml-upload-dialog.component.html',
    styleUrls: ['./opml-upload-dialog.component.scss']
})
export class OpmlUploadDialogComponent implements OnInit, OnDestroy {
    progress = 0;
    private _sub: Subscription = new Subscription()

    constructor(public dialogRef: MatDialogRef<OpmlUploadDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private Upload: NgxfUploaderService,
		private settingService: SettingService,
		private snackBar: MatSnackBar,
		public store: Store<IAppState>) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
	this._sub.unsubscribe();
    }

    onNoClick(): void {
	this.dialogRef.close();
    }

    uploadFile(file: File | FileError): void {
	if (!(file instanceof File)) {
	    this.snackBar.open('File error', 'err')
	    return;
	}

	this._sub.add(this.Upload.upload({
	    url: this.settingService.api_base()+'/api/opml/import',
	    filesKey: 'opml',
	    files: file,
	    process: true
	}).subscribe(
	    (event: UploadEvent) => {
		console.log(event);
		this.progress = event.percent;
		if (event.status === UploadStatus.Completed) {
		    this.store.dispatch({type: GET_FEEDTREE});
		    this.dialogRef.close()
		    this.snackBar.open('File upload success!')
		}
	    },
	    (err) => {
		this.snackBar.open(err)
	    },
	    () => {
		console.log('complete');
	    }))
    }
}

