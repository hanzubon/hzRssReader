import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { IAppState } from '../../../../store/index';
import { Observable, Subscription } from 'rxjs';

import { DELETE_CATEGORY } from '../../../../store/category/category.actions';
import { CategoryDeleteDialogComponent } from '../category-delete-dialog/category-delete-dialog.component';

@Component({
  selector: 'app-category-deleter',
  templateUrl: './category-deleter.component.html',
  styleUrls: ['./category-deleter.component.scss']
})
export class CategoryDeleterComponent implements OnInit, OnDestroy {
    @Input()
    cat_id: number

    @Input()
    name: string

    private _sub: Subscription = new Subscription()

    constructor(public dialog: MatDialog, public store: Store<IAppState>) {}

    ngOnInit() {}

    ngOnDestroy() {
	this._sub.unsubscribe();
    }

    open_category_delete_dialog(): void {
	const dialogRef = this.dialog.open(CategoryDeleteDialogComponent, {width: '300px', data:{name: this.name, target_cat_id: this.cat_id, cat_id: -1}})

	this._sub.add(dialogRef.afterClosed().subscribe(result => {
	    console.log(result)
	    if (!!!result
		|| !!!result.target_cat_id || result.target_cat_id != this.cat_id
		|| !!!result.cat_id || result.cat_id == this.cat_id) return
	    console.log(result)
	    this.store.dispatch({type: DELETE_CATEGORY, payload: {target_cat_id: result['target_cat_id'], cat_id: result['cat_id'], cat_name: result['cat_name']}})
	}))
    }
}
