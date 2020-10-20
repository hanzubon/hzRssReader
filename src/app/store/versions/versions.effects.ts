import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { concatMap, map, catchError } from 'rxjs/operators';
import { IVersions } from './versions.reducer';
import { SettingService } from '../../shared/setting/setting.service';

import {
    GET_VERSIONS, getVersions, getVersionsSuccess, getVersionsFail
} from './versions.actions';

@Injectable()
export class VersionsEffects {
    @Effect()
    getVersions$ = this.actions$
	.pipe(
	    ofType(GET_VERSIONS),
	    concatMap((action: getVersions) => {
		return this.http.get<any>(this.settingService.api_base()+'/api/versions')
		    .pipe(
			catchError((error) => of(new getVersionsFail(error))),
			map((response: IVersions) => new getVersionsSuccess(response))
		    )
	    })
	)

    constructor(private actions$: Actions, public http: HttpClient, private settingService: SettingService) {}
}
