import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, catchError } from 'rxjs/operators';
import { SettingService } from '../../shared/setting/setting.service';

import { IItemStatus } from './item.reducer'
import {
    UPDATE_ITEM_STATUS, updateItemStatus, updateItemStatusSuccess, updateItemStatusFail
} from './item.actions';

@Injectable()
export class ItemStatusEffects {
    @Effect()
    ItemStatus$ = this.actions$
	.pipe(
	    ofType(UPDATE_ITEM_STATUS),
	    concatMap((action: updateItemStatus) => {
		let param = {...action.payload}
		return this.http.post<any>(this.settingService.api_base()+'/api/item/status', param)
		    .pipe(
			catchError((error) => of(new updateItemStatusFail(error))),
			map((response: IItemStatus) => new updateItemStatusSuccess(response))
		    )
	    })
	)

    constructor(private actions$: Actions, public http: HttpClient, private settingService: SettingService) {}
}
