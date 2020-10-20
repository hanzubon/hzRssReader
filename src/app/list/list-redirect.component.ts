import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/index';
import { Observable, Subscription } from 'rxjs';

import { GET_FIRST_CATEGORY } from '../store/categories/categories.actions';
import { ICategory } from '../store/categories/categories.reducer';

@Component({
    selector: 'app-list-redirect',
    templateUrl: './list-redirect.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListRedirectComponent implements OnInit, OnDestroy {
    private cat$: Observable<ICategory>;
    private _sub: Subscription = new Subscription()

    constructor(public store: Store<IAppState>, private route: ActivatedRoute, private router: Router) {
        this.cat$ = this.store.select('firstcategory');
    }

    ngOnInit() {
	const type = localStorage.getItem('list_id_type')
	const id = localStorage.getItem('list_id')
	if (!!type && !!id && (type == 'feed' || type == 'cat')) {
	    let url = '/list/'+(type == 'feed' ? 'feed/' : '')+id
	    this.router.navigate([url])
	} else {
	    this.store.dispatch({type: GET_FIRST_CATEGORY})
	    this._sub.add(this.cat$.subscribe(val => {
		if (!!val)
		    this.router.navigate(['/list/'+val['id']])
	    }))
	}
    }

    ngOnDestroy() {
	this._sub.unsubscribe();
    }
}
