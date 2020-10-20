import { Component, Inject, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from "rxjs";

import { OpmlUploadDialogComponent } from '../opml-upload-dialog/opml-upload-dialog.component';

@Component({
    selector: 'app-opml-uploader',
    templateUrl: './opml-uploader.component.html',
    styleUrls: ['./opml-uploader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpmlUploaderComponent implements OnInit, OnDestroy  {
    private _sub: Subscription = new Subscription()

    constructor(public dialog: MatDialog) {}

    ngOnInit() {}

    ngOnDestroy() {
	this._sub.unsubscribe();
    }

    open_opml_upload_dialog(): void {
	const dialogRef = this.dialog.open(OpmlUploadDialogComponent, {width: '300px', data:{}})

	this._sub.add(dialogRef.afterClosed().subscribe(result => {
	    console.log(result)
	}))
    }
}

