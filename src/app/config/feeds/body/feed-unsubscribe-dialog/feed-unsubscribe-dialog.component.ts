import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-unsubscribe-dialog',
  templateUrl: './feed-unsubscribe-dialog.component.html',
  styleUrls: ['./feed-unsubscribe-dialog.component.scss']
})
export class FeedUnsubscribeDialogComponent {
    constructor(public dialogRef: MatDialogRef<FeedUnsubscribeDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onNoClick(): void {
	this.dialogRef.close();
    }
}

