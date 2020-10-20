import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-category-edit-dialog',
  templateUrl: './category-edit-dialog.component.html',
  styleUrls: ['./category-edit-dialog.component.scss']
})
export class CategoryEditDialogComponent {
    constructor(public dialogRef: MatDialogRef<CategoryEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onNoClick(): void {
	this.dialogRef.close();
    }
}

