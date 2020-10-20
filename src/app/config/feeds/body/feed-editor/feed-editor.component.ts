import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { IAppState } from '../../../../store/index';
import { Observable, Subscription } from 'rxjs';

import { IFeedTreeFeed } from '../../../../store/feedtree/feedtree.reducer';
import { UPDATE_FEED } from '../../../../store/feed/feed.actions';
import { FeedEditDialogComponent } from '../feed-edit-dialog/feed-edit-dialog.component';

@Component({
  selector: 'app-feed-editor',
  templateUrl: './feed-editor.component.html',
  styleUrls: ['./feed-editor.component.scss']
})
export class FeedEditorComponent implements OnInit, OnDestroy  {
    @Input()
    feed: IFeedTreeFeed

    @Input()
    cat_id: number

    private _sub: Subscription = new Subscription()

    constructor(public dialog: MatDialog, public store: Store<IAppState>) {}

    ngOnInit() {}
    ngOnDestroy() {
	this._sub.unsubscribe();
    }

    open_feed_edit_dialog(): void {
	const dialogRef = this.dialog.open(FeedEditDialogComponent, {width: '300px', data:{name: this.feed.name, feed_id: this.feed.id, feed_url: this.feed.feed_url, cat_id: this.cat_id}})

	this._sub.add(dialogRef.afterClosed().subscribe(result => {
	    console.log(result)
	    if (!!!result || !!!result.feed_id || result.feed_id != this.feed.id) return
	    console.log(result)
	    this.store.dispatch({type: UPDATE_FEED, payload: {feed_id: result.feed_id, name: result.name, cat_id: result.cat_id, cat_name: result.cat_name}})
	}))
    }
}
