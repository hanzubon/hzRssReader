import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Title } from '@angular/platform-browser';

import { Store } from '@ngrx/store';
import { IAppState } from '../../store/index';
import { Observable, Subscription } from 'rxjs';

import { GET_CATEGORY } from '../../store/category/category.actions';
import { ICategoryInfo } from '../../store/category/category.reducer';

import { GET_FEED } from '../../store/feed/feed.actions';
import { IFeedInfo } from '../../store/feed/feed.reducer';

import { IHeadline } from '../../store/headlines/headlines.reducer';

@Component({
    selector: 'app-list-menu',
    templateUrl: './list-menu.component.html',
    styleUrls: ['./list-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:[Title]
})
export class ListMenuComponent implements OnInit {
    catinfo$: Observable<ICategoryInfo>;
    feedinfo$: Observable<IFeedInfo>;
    headlines$: Observable<IHeadline>;

    title: string = ''
    mode: string = 'cat'
    id: number = 0
    search_done = false
    query = '';
    private _sub: Subscription = new Subscription()

    constructor(public store: Store<IAppState>, private route: ActivatedRoute, private cd: ChangeDetectorRef, private title_t:Title) {
	this.catinfo$ = this.store.select('getcategory')
	this.feedinfo$ = this.store.select('getfeed')
	this.headlines$ = this.store.select('headlines')
    }

    ngOnInit() {
	this._sub.add(this.catinfo$.subscribe(v => {
	    if (this.mode != 'cat' || !!!v || !!!v.name || v.id != this.id) return
	    this.title = v.name
	    this.title_t.setTitle('Category: '+this.title+' - hzRssReader')
	    this.cd.markForCheck();
	}))

	this._sub.add(this.feedinfo$.subscribe(v => {
	    if (this.mode != 'feed' || !!!v || !!!v.name || v.id != this.id) return
	    this.title = v.name
	    this.title_t.setTitle('Feed: '+this.title+' - hzRssReader')
	    this.cd.markForCheck();
	}))

	this._sub.add(this.headlines$.subscribe(v => {
	    if (this.mode != 'search' || !!!v || v.meta.type != 'search' || !!!v.meta.query || v.meta.query != this.query) return
	    this.search_done = true
	    this.title = 'Search: '+this.query+ ' ('+v.meta.count+')'
	    this.title_t.setTitle('Searchd: '+this.title+' - hzRssReader')
	    this.cd.markForCheck();
	}))

	this._sub.add(this.route.params.subscribe(params => {
	    if (typeof params['cat_id'] != 'undefined') {
		this.mode = 'cat'
		this.id = params['cat_id']
		this.store.dispatch({type: GET_CATEGORY, payload: {cat_id: params['cat_id']}})
	    } else if (typeof params['query'] != 'undefined') {
		this.mode = 'search'
		this.query = params['query']
		if (!this.search_done) {
		    this.title = 'Search: '+this.query+ ' (検索中)'
		    this.title_t.setTitle('Searchd: '+this.title+' - hzRssReader')
		    this.cd.markForCheck();
		}
	    } else {
		this.mode = 'feed'
		this.id = params['feed_id']
		this.store.dispatch({type: GET_FEED, payload: {feed_id: params['feed_id']}})
	    }
	}))
    }

    ngOnDestroy() {
	this._sub.unsubscribe();
    }
}
