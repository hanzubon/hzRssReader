import { Injectable, ApplicationRef } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/index';
import { Observable, Subscription } from 'rxjs';

import { ISubscribeFeed } from '../../store/feed/feed.reducer';
import { GET_FEEDTREE } from '../../store/feedtree/feedtree.actions';
import { IFeedTreeCategory } from '../../store/feedtree/feedtree.reducer';
import { IEditCategory } from '../../store/category/category.reducer';

@Injectable()
export class ActionFeedbackService {
    snackbarRef: MatSnackBarRef<SimpleSnackBar>

    private _sub: Subscription = new Subscription()

    unsubscribefeed$: Observable<ISubscribeFeed>
    subscribefeed$: Observable<ISubscribeFeed>
    updatefeed$: Observable<ISubscribeFeed>
    updatecategory$: Observable<IEditCategory>
    deletecategory$: Observable<IEditCategory>

    constructor(private snackBar: MatSnackBar, private store: Store<IAppState>) {}

    init() {
	this.unsubscribefeed$ = this.store.select('unsubscribefeed')
	this.subscribefeed$ = this.store.select('subscribefeed')
	this.updatefeed$ = this.store.select('updatefeed')
	this.updatecategory$ = this.store.select('updatecategory')
	this.deletecategory$ = this.store.select('deletecategory')

    	this._sub.add(this.unsubscribefeed$.subscribe(v => {
	    this.list_update(v)
	}))
	this._sub.add(this.subscribefeed$.subscribe(v => {
	    this.list_update(v)
	}))
	this._sub.add(this.updatefeed$.subscribe(v => {
	    this.list_update(v)
	}))
	this._sub.add(this.updatecategory$.subscribe(v => {
	    this.list_update(v)
	}))
	this._sub.add(this.deletecategory$.subscribe(v => {
	    this.list_update(v)
	}))
    }

    finisih() {
	this._sub.unsubscribe();
    }

    list_update(v) {
	if (!!!v) return
	console.log(v)
	let opts = {}
	if (v.status == 'ok')
	    opts['duration'] = 5000
	this.snackBar.open(v.message, v.status, opts)
	this.store.dispatch({type: GET_FEEDTREE})
    }
}
