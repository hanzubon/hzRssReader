import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, catchError } from 'rxjs/operators';
import { SettingService } from '../../shared/setting/setting.service';

import { IFeed } from './feeds.reducer'
import { GET_FEEDS, getFeeds, getFeedsSuccess, getFeedsFail } from './feeds.actions';

@Injectable()
export class FeedsEffects {
    @Effect()
    Feeds$ = this.actions$
	.pipe(
	    ofType(GET_FEEDS),
	    concatMap((action: getFeeds) => {
		let param = {...action.payload}
		const cat_id = param['cat_id']
		if (cat_id < 1) return []
		return this.http.post<any>(this.settingService.api_base()+'/api/feeds/'+cat_id, param)
		    .pipe(
			catchError((error) => of(new getFeedsFail(error))),
			map((response: IFeed[]) => new getFeedsSuccess(response))
		    )
	    })
	)

    constructor(private actions$: Actions, public http: HttpClient, private settingService: SettingService) {}
}
