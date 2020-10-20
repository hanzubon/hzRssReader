import { Component, OnInit, OnDestroy, Input, ViewChild, QueryList, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { IPageInfo, VirtualScrollerComponent } from 'ngx-virtual-scroller';

import { Store } from '@ngrx/store';
import { IAppState } from '../../store/index';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';

import { SideNavService } from '../../shared/sidenav/sidenav.service';
import { SettingService, ISettings } from '../../shared/setting/setting.service';

import { GET_HEADLINES, GET_SEARCH } from '../../store/headlines/headlines.actions';
import { IHeadline } from '../../store/headlines/headlines.reducer';

import { IItemStatus } from '../../store/item/item.reducer'
import { UPDATE_ITEM_STATUS } from '../../store/item/item.actions';

import { GET_CATEGORIES } from '../../store/categories/categories.actions';

import { GET_FEEDS } from '../../store/feeds/feeds.actions';

@Component({
    selector: 'app-list-body',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
    public headlines$: Observable<IHeadline>
    private itemstatus$: Observable<IItemStatus>

    public loading: boolean = true

    private _sub: Subscription = new Subscription()

    private headline_type = 'category'

    // つぎにここから既読処理する
    private next_read_start: number = 0

    @ViewChild('scroll')
    private virtualScroller: VirtualScrollerComponent

    private trigger_bottom_event: boolean = false

    private settings: ISettings

    private statuses: BehaviorSubject<boolean>[]

    constructor(public store: Store<IAppState>,
		private route: ActivatedRoute,
		private sidenavService: SideNavService,
		public settingService: SettingService,
		private cd: ChangeDetectorRef) {
	this.headlines$ = this.store.select('headlines')
	this.itemstatus$ = this.store.select('item')
    }

    ngOnInit() {
	this._sub.add(this.route.params.subscribe(params => {
	    this.loading = true
	    this.cd.markForCheck()
	    if (typeof params['cat_id'] != 'undefined') {
		this.headline_type = 'category'
		this.store.dispatch({type: GET_HEADLINES, payload: {cat_id: params['cat_id']}})
	    } else if (typeof params['query'] != 'undefined') {
		this.headline_type = 'search'
		this.store.dispatch({type: GET_SEARCH, payload: {query: params['query']}})
	    } else {
		this.headline_type = 'feed'
		this.store.dispatch({type: GET_HEADLINES, payload: {feed_id: params['feed_id']}})
	    }
	    this.store.dispatch({type: GET_CATEGORIES})
	    console.log('DISPATCH')
	    this.sidenavService.close()
	}))
	this._sub.add(this.headlines$.subscribe(v => {
	    this.statuses = []
	    this.next_read_start = 0
	    this.trigger_bottom_event = false
	    if (v && v?.meta?.type == this.headline_type) this.loading = false
	    if (!this.virtualScroller) return
	    this.virtualScroller.scrollToIndex(0)
	}))
	this._sub.add(this.itemstatus$.subscribe(v => {
	    if (!!!v || !!!v['result']) return
	    v['id'].forEach(i => {
		const st = this.getStatusSubject(i, v['status'])
		st.next(v['status'])
	    })
	}))
	this.settings = this.settingService.getSettings()
    }

    ngOnDestroy() {
	this._sub.unsubscribe();
    }

    getStatusSubject(id, status) {
	if (typeof this.statuses[id] == 'undefined')
	    this.statuses[id] = new BehaviorSubject(status)
	return this.statuses[id]
    }

    isHead(item) {
	return (typeof item['_head'] != 'undefined')
    }

    changeList(event: IPageInfo, items: any[]) {
	if (!this.settings.read_with_scroll
	    || event.startIndexWithBuffer == 0
	    || event.startIndexWithBuffer <= this.next_read_start ) return

	for (let i = this.next_read_start; i < event.startIndexWithBuffer; i++) {
	    if (!!items[i]['id']) {
		this.store.dispatch({type: UPDATE_ITEM_STATUS, payload: {id: items[i]['id'], status: true}})
	    }
	}
	this.next_read_start = event.startIndexWithBuffer;
    }

    bottomEvent(event: IPageInfo, items: any[]) {
	if (!this.settings.read_reach_bottom) return

	if (!this.trigger_bottom_event) {
	    this.trigger_bottom_event = true
	    setTimeout(() => {
		this.readAll(items, false)
	    }, 100)
	}
    }

    readAll(items: any[], open_sidebar = true) {
	if (!items || !items.length) return
	// FIXME::
	// 件数が多いとそれだけの数の HTTP request 投げることになるんだよなぁ
	// まとめて 1 call で送れるような API 作るほうがいいか?
	for (let i = this.next_read_start; i < items.length; i++) {
	    if (!!items[i]['id']) {
		this.store.dispatch({type: UPDATE_ITEM_STATUS, payload: {id: items[i]['id'], status: true}})
	    }
	}
	this.next_read_start = items.length;

	// FIXME: いきなり category を reload してるけど
	// ホントは上記の dispatch がもろもろ終わって反応が全部戻ってからの方がいい
	// が ちょっとめんどくさそうだし厳密にやる必要もないから settimer かなんかで
	// delay するとかでいいかな...
	setTimeout(() => {
	    this.store.dispatch({type: GET_CATEGORIES})

	    const s = localStorage.getItem('open_state')
	    let open_state = {}
	    if (!!s) {
		try {
		    open_state = JSON.parse(s)
		} catch (e) {
		    open_state = {}
		}
	    }
	    Object.keys(open_state).forEach(k => {
		if (open_state[k] == 'open')
		    this.store.dispatch({type: GET_FEEDS, payload: {cat_id: k}})
	    })
	}, 1000)

	if (open_sidebar)
	    this.sidenavService.open()
    }
}
