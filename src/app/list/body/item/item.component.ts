import { Component, OnInit, OnDestroy, Input, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IHeadlineData } from '../../../store/headlines/headlines.reducer'
import { IItemStatus } from '../../../store/item/item.reducer'
import { UPDATE_ITEM_STATUS } from '../../../store/item/item.actions';
import { MatCheckbox } from "@angular/material/checkbox";

import { Store } from '@ngrx/store'
import { IAppState } from '../../../store/index'
import { Observable, Subscription } from 'rxjs'

// ChangeDetectionStrategy.OnPush だと ngx-virtual-scroll 側での変更に
// 追従できないことがあるっぽいので default にしてみる 2019-03-21
// そういうことでもないっぽい それでもフラッシュする OnPush に戻す
@Component({
    selector: 'app-list-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ListItemComponent implements OnInit, OnDestroy {
    @Input()
    item: IHeadlineData

    @Input()
    status: Observable<boolean>

    checked: boolean = false
    private _sub: Subscription = new Subscription()

    constructor(public store: Store<IAppState>, private cd: ChangeDetectorRef) {}

    ngOnInit() {
	this._sub.add(this.status.subscribe(v => {
	    this.checked = v;
	    this.cd.markForCheck()
	}))
    }

    ngOnDestroy() {
	this._sub.unsubscribe();
    }

    toggleRead(event) {
	this.store.dispatch({type: UPDATE_ITEM_STATUS, payload: {id: [this.item.id], status: !!event.checked}})
    }
}
