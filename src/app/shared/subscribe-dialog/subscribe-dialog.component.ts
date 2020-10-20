import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { IAppState } from '../../store/index';
import { Observable } from 'rxjs';

import { GET_CATEGORIES_ALL } from '../../store/categories/categories.actions';
import { ICategory } from '../../store/categories/categories.reducer';

@Component({
  selector: 'app-subscribe-dialog',
  templateUrl: './subscribe-dialog.component.html',
  styleUrls: ['./subscribe-dialog.component.scss']
})
export class SubscribeDialogComponent implements OnInit  {
    @Input()
    cat$: Observable<ICategory[]>

    constructor(public store: Store<IAppState>, public dialogRef: MatDialogRef<SubscribeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
	this.cat$ = this.store.select('categoriesall')
    }

    ngOnInit() {
 	this.store.dispatch({type: GET_CATEGORIES_ALL})
    }

    onNoClick(): void {
	this.dialogRef.close();
    }
}

