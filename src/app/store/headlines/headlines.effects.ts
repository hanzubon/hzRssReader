import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, catchError } from 'rxjs/operators';
import { SettingService } from '../../shared/setting/setting.service';


import { IHeadline } from './headlines.reducer'
import {
    GET_HEADLINES, getHeadlines, getHeadlinesSuccess, getHeadlinesFail,
    GET_SEARCH, getSearch, getSearchSuccess, getSearchFail
} from './headlines.actions';

@Injectable()
export class HeadlinesEffects {
    @Effect()
    Headlines$ = this.actions$
	.pipe(
	    ofType(GET_HEADLINES),
	    concatMap((action: getHeadlines) => {
		let param = {...action.payload}
		let url = this.settingService.api_base()+'/api/items/';
		if (!!param['feed_id']) {
		    url += 'feed/'+param['feed_id']
		} else {
		    url += param['cat_id']
		}
		const settings = this.settingService.getSettings()
		param['mode'] = settings.headlines_view_mode
		param['flatten'] = 1
		return this.http.post<any>(url, param)
		    .pipe(
			catchError((error) => of(new getHeadlinesFail(error))),
			map((response: IHeadline) => new getHeadlinesSuccess(response))
		    )
	    })
	)

    @Effect()
    Search$ = this.actions$
	.pipe(
	    ofType(GET_SEARCH),
	    concatMap((action: getSearch) => {
		let param = {...action.payload}
		param['flatten'] = 1
		return this.http.post<any>(this.settingService.api_base()+'/api/items/search', param)
		    .pipe(
			catchError((error) => of(new getSearchFail(error))),
			map((response: IHeadline) => new getSearchSuccess(response))
		    )
	    })
	)

    constructor(private actions$: Actions, public http: HttpClient, private settingService: SettingService) {}
}
