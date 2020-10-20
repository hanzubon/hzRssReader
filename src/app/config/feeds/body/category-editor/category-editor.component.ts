import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { IAppState } from '../../../../store/index';
import { Observable, Subscription } from 'rxjs';

import { UPDATE_CATEGORY } from '../../../../store/category/category.actions';
import { CategoryEditDialogComponent } from '../category-edit-dialog/category-edit-dialog.component';

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category-editor.component.scss']
})
export class CategoryEditorComponent implements OnInit, OnDestroy  {
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

    open_category_edit_dialog(): void {
	const dialogRef = this.dialog.open(CategoryEditDialogComponent, {width: '300px', data:{name: this.name, cat_id: this.cat_id}})

	this._sub.add(dialogRef.afterClosed().subscribe(result => {
	    console.log(result)
	    if (!!!result || !!!result.cat_id || result.cat_id != this.cat_id) return
	    console.log(result)
	    this.store.dispatch({type: UPDATE_CATEGORY, payload: {cat_id: result.cat_id, name: result.name}})
	}))
    }
}
