import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { IAppState } from '../../../../store/index';
import { Observable, Subscription } from 'rxjs';

import { UNSUBSCRIBE_FEED } from '../../../../store/feed/feed.actions';
import { ISubscribeFeed } from '../../../../store/feed/feed.reducer';

import { FeedUnsubscribeDialogComponent } from '../feed-unsubscribe-dialog/feed-unsubscribe-dialog.component';

@Component({
  selector: 'app-feed-unsubscriber',
  templateUrl: './feed-unsubscriber.component.html',
  styleUrls: ['./feed-unsubscriber.component.scss']
})
export class FeedUnsubscriberComponent implements OnInit, OnDestroy  {
    @Input()
    name: string

    @Input()
    feed_id: number

    unsubscribefeed$: Observable<ISubscribeFeed>
    private _sub: Subscription = new Subscription()

    constructor(public dialog: MatDialog, public store: Store<IAppState>) {
	this.unsubscribefeed$ = this.store.select('unsubscribefeed')
    }

    ngOnInit() {}

    ngOnDestroy() {
	this._sub.unsubscribe();
    }

    open_unsubscribe_dialog(): void {
	const dialogRef = this.dialog.open(FeedUnsubscribeDialogComponent, {width: '300px', data:{name: this.name, feed_id: this.feed_id}})

	this._sub.add(dialogRef.afterClosed().subscribe(result => {
	    console.log(result)
	    if (!!!result || !!!result.feed_id || result.feed_id != this.feed_id) return
	    console.log(result)
	    this.store.dispatch({type: UNSUBSCRIBE_FEED, payload: {feed_id: result.feed_id}})
	}))
    }
}
