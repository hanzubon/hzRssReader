import { Component, Input, OnInit, OnDestroy, HostListener, Injectable, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { IAppState } from '../../store/index';
import { Observable, Subscription } from 'rxjs';

import { GET_CATEGORIES } from '../../store/categories/categories.actions';
import { ICategory } from '../../store/categories/categories.reducer';

import { GET_FEEDS } from '../../store/feeds/feeds.actions';
import { IFeed } from '../../store/feeds/feeds.reducer';

const AUTORELOAD_PERIOD = 300000;

@Component({
    selector: 'app-list-sidebar',
    templateUrl: './list-sidebar.component.html',
    styleUrls: ['./list-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListSidebarComponent implements OnInit, OnDestroy {
    cat$: Observable<ICategory[]>;
    feeds$: Observable<IFeed[]>;

    private autoreloader;

    public cat_id: number;
    public feed_id: number;

    open_state = {}
    feeds_cache: IFeed[][] = []

    private _sub: Subscription = new Subscription()

    @HostListener('document:visibilitychange')
    onChange() {
	if (document.visibilityState == 'visible') {
	    console.log('VISIBLE')
	    let self = this
	    self.store.dispatch({type: GET_CATEGORIES})
	    this.autoreloader = setInterval(function() {
		self.store.dispatch({type: GET_CATEGORIES})
		console.log('AUTO RELOAD CATEGORIES')
	    }, AUTORELOAD_PERIOD);
	} else {
	    clearInterval(this.autoreloader)
	}
    }

    constructor(public store: Store<IAppState>, private route: ActivatedRoute, private cd: ChangeDetectorRef) {
	this.cat$ = this.store.select('categories')
	this.feeds$ = this.store.select('feeds')
    }

    ngOnInit() {
	this.store.dispatch({type: GET_CATEGORIES})
	const s = localStorage.getItem('open_state')
	if (!!s) {
	    try {
		this.open_state = JSON.parse(s)
	    } catch (e) {
		this.open_state = {}
	    }
	}
	Object.keys(this.open_state).forEach(k => {
	    if (this.open_state[k] == 'open')
		this.store.dispatch({type: GET_FEEDS, payload: {cat_id: k}})
	})
	console.log(this.open_state)
	this._sub.add(this.route.params.subscribe(params => {
	    if (typeof params['cat_id'] != 'undefined') {
		this.cat_id = params['cat_id']
		this.feed_id = null
	    } else {
		this.cat_id = null
		this.feed_id = params['feed_id']
	    }
	    this.cd.markForCheck()
	}))

	this._sub.add(this.feeds$.subscribe(v => {
	    if (!!!v || !v[0]) return
	    this.feeds_cache[v[0]['cat_id']] = v
	    this.cd.markForCheck()
	}))
    }

    ngOnDestroy() {
	this._sub.unsubscribe();
    }

    initOpenState(cat_id) {
	if (typeof this.open_state[cat_id] == 'undefined')
	    this.open_state[cat_id] = 'close'
    }

    toggleFeedOpenState(cat_id: number) {
	this.initOpenState(cat_id)
	this.open_state[cat_id] = this.open_state[cat_id] == 'open' ? 'close' : 'open'
	if (this.open_state[cat_id] == 'open')
	    this.store.dispatch({type: GET_FEEDS, payload: {cat_id: cat_id}})
	localStorage.setItem('open_state', JSON.stringify(this.open_state));
    }

    getFeedsOpenState(cat_id: number) {
	this.initOpenState(cat_id)
	return this.open_state[cat_id]
    }
}
