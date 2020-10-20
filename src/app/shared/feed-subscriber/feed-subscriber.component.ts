import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { IAppState } from '../../store/index';
import { Observable, Subscription } from 'rxjs';

import { SUBSCRIBE_FEED } from '../../store/feed/feed.actions';
import { ISubscribeFeed } from '../../store/feed/feed.reducer';

import { SubscribeDialogComponent } from '../subscribe-dialog/subscribe-dialog.component';

@Component({
  selector: 'app-feed-subscriber',
  templateUrl: './feed-subscriber.component.html',
  styleUrls: ['./feed-subscriber.component.scss']
})
export class FeedSubscriberComponent implements OnInit, OnDestroy  {
    private _sub: Subscription = new Subscription()

    constructor(public dialog: MatDialog, public store: Store<IAppState>) {}

    ngOnInit() {}

    ngOnDestroy() {
	this._sub.unsubscribe();
    }

    open_subscribe_dialog(): void {
	const dialogRef = this.dialog.open(SubscribeDialogComponent, {width: '300px', autoFocus: true, restoreFocus: true, data:{}})

	this._sub.add(dialogRef.afterClosed().subscribe(result => {
	    if (!!!result || !!!result.url) return;
	    console.log(result)
	    this.store.dispatch({type: SUBSCRIBE_FEED, payload: {url: result.url, cat_id: result.cat_id, cat_name: result.cat_name}})
	}))
    }
}

