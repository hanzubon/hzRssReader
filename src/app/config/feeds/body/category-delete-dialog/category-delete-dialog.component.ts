import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { IAppState } from '../../../../store/index';
import { Observable } from 'rxjs';

import { GET_CATEGORIES_ALL } from '../../../../store/categories/categories.actions';
import { ICategory } from '../../../../store/categories/categories.reducer';

@Component({
  selector: 'app-category-delete-dialog',
  templateUrl: './category-delete-dialog.component.html',
  styleUrls: ['./category-delete-dialog.component.scss']
})
export class CategoryDeleteDialogComponent implements OnInit {
    @Input()
    cat$: Observable<ICategory[]>

    constructor(public store: Store<IAppState>,
		public dialogRef: MatDialogRef<CategoryDeleteDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
        this.cat$ = this.store.select('categoriesall')
    }

    ngOnInit() {
	this.store.dispatch({type: GET_CATEGORIES_ALL})
	console.log(this.data)
    }

    onNoClick(): void {
	this.dialogRef.close();
    }
}

