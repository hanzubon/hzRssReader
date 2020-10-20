import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, catchError } from 'rxjs/operators';
import { SettingService } from '../../shared/setting/setting.service';

import { ISubscribeFeed, IFeedInfo } from './feed.reducer'
import {
    SUBSCRIBE_FEED, subscribeFeed, subscribeFeedSuccess, subscribeFeedFail,
    UNSUBSCRIBE_FEED, unsubscribeFeed, unsubscribeFeedSuccess, unsubscribeFeedFail,
    UPDATE_FEED, updateFeed, updateFeedSuccess, updateFeedFail,
    GET_FEED, getFeed, getFeedSuccess, getFeedFail
} from './feed.actions';

@Injectable()
export class FeedEffects {
    @Effect()
    SubscribeFeed$ = this.actions$
	.pipe(
	    ofType(SUBSCRIBE_FEED),
	    concatMap((action: subscribeFeed) => {
		let param = {...action.payload}
		return this.http.post<any>(this.settingService.api_base()+'/api/feed/subscribe', param)
		    .pipe(
			catchError((error) => of(new subscribeFeedFail(error))),
			map((response: ISubscribeFeed) => new subscribeFeedSuccess(response))
		    )
	    })
	)

    @Effect()
    UnSubscribeFeed$ = this.actions$
	.pipe(
	    ofType(UNSUBSCRIBE_FEED),
	    concatMap((action: unsubscribeFeed) => {
		let param = {...action.payload}
		return this.http.post(this.settingService.api_base()+'/api/feed/unsubscribe', param)
		    .pipe(
			catchError((error) => of(new unsubscribeFeedFail(error))),
			map((response: ISubscribeFeed) => new unsubscribeFeedSuccess(response))
		    )
	    })
	)

    @Effect()
    UpdateFeed$ = this.actions$
	.pipe(
	    ofType(UPDATE_FEED),
	    concatMap((action: updateFeed) => {
		let param = {...action.payload}
		return this.http.post(this.settingService.api_base()+'/api/feed/edit', param)
		    .pipe(
			catchError((error) => of(new updateFeedFail(error))),
			map((response: ISubscribeFeed) => new updateFeedSuccess(response))
		    )
	    })
	)

    @Effect()
    GetFeed$ = this.actions$
	.pipe(
	    ofType(GET_FEED),
	    concatMap((action: getFeed) => {
		return this.http.get(this.settingService.api_base()+'/api/feed/'+action.payload.feed_id)
		    .pipe(
			catchError((error) => of(new getFeedFail(error))),
			map((response: IFeedInfo) => new getFeedSuccess(response))
		    )
	    })
	)

    constructor(private actions$: Actions, public http: HttpClient, private settingService: SettingService) {}
}
