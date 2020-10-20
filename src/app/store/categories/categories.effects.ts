import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, catchError } from 'rxjs/operators';
import { SettingService } from '../../shared/setting/setting.service';

import { ICategory } from './categories.reducer'
import {
    GET_CATEGORIES, getCategories, getCategoriesSuccess, getCategoriesFail,
    GET_CATEGORIES_ALL, getCategoriesAll, getCategoriesAllSuccess, getCategoriesAllFail,
    GET_FIRST_CATEGORY, getFirstCategory, getFirstCategorySuccess, getFirstCategoryFail
} from './categories.actions';

@Injectable()
export class CategoriesEffects {
    @Effect()
    Categories$ = this.actions$
	.pipe(
	    ofType(GET_CATEGORIES),
	    concatMap((action: getCategories) => {
		let param = {...action.payload}
		const settings = this.settingService.getSettings()
		if (settings.categories_view_mode == 'all') param['all_state'] = 1
		return this.http.post<any>(this.settingService.api_base()+'/api/categories', param)
		    .pipe(
			catchError((error) => of(new getCategoriesFail(error))),
			map((response: ICategory[]) => new getCategoriesSuccess(response))
		    )
	    })
	)

    constructor(private actions$: Actions, public http: HttpClient, private settingService: SettingService) {}
}

@Injectable()
export class CategoriesAllEffects {
    @Effect()
    CategoriesAll$ = this.actions$
	.pipe(
	    ofType(GET_CATEGORIES_ALL),
	    concatMap((action: getCategoriesAll) => {
		return this.http.post<any>(this.settingService.api_base()+'/api/categories/simple', {})
		    .pipe(
			catchError((error) => of(new getCategoriesAllFail(error))),
			map((response: ICategory[]) => new getCategoriesAllSuccess(response))
		    )
	    })
	)

    constructor(private actions$: Actions, public http: HttpClient, private settingService: SettingService) {}
}

@Injectable()
export class FirstCategoryEffects {
    @Effect()
    FirstCategory$ = this.actions$
	.pipe(
	    ofType(GET_FIRST_CATEGORY),
	    concatMap((action: getFirstCategory) => {
		return this.http.post<any>(this.settingService.api_base()+'/api/categories/first', {})
		    .pipe(
			catchError((error) => of(new getFirstCategoryFail(error))),
			map((response: ICategory) => new getFirstCategorySuccess(response))
		    )
	    })
	)

    constructor(private actions$: Actions, public http: HttpClient, private settingService: SettingService) {}
}
