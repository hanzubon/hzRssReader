import { Effect, Actions, ofType } from '@ngrx/effects'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { concatMap, map, catchError } from 'rxjs/operators'
import { SettingService } from '../../shared/setting/setting.service'

import { IFeedTreeCategory } from './feedtree.reducer'
import { GET_FEEDTREE, getFeedTree, getFeedTreeSuccess, getFeedTreeFail } from './feedtree.actions'

@Injectable()
export class FeedTreeEffects {
    @Effect()
    FeedTree$ = this.actions$
	.pipe(
	    ofType(GET_FEEDTREE),
	    concatMap((action: getFeedTree) => {
		let param = {...action.payload}
		return this.http.post<any>(this.settingService.api_base()+'/api/feeds/tree', param)
		    .pipe(
			catchError((error) => of(new getFeedTreeFail(error))),
			map((response: IFeedTreeCategory[]) => new getFeedTreeSuccess(response))
		    )
	    })
	)

    constructor(private actions$: Actions, public http: HttpClient, private settingService: SettingService) {}
}
