import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, catchError } from 'rxjs/operators';
import { SettingService } from '../../shared/setting/setting.service';

import { IEditCategory, ICategoryInfo} from './category.reducer'
import {
    UPDATE_CATEGORY, updateCategory, updateCategorySuccess, updateCategoryFail,
    DELETE_CATEGORY, deleteCategory, deleteCategorySuccess, deleteCategoryFail,
    GET_CATEGORY, getCategory, getCategorySuccess, getCategoryFail
} from './category.actions';

@Injectable()
export class CategoryEffects {
    @Effect()
    updateCategory$ = this.actions$
	.pipe(
	    ofType(UPDATE_CATEGORY),
	    concatMap((action: updateCategory) => {
		let param = {...action.payload}
		return this.http.post<any>(this.settingService.api_base()+'/api/category/edit', param)
		    .pipe(
			catchError((error) => of(new updateCategoryFail(error))),
			map((response: IEditCategory) => new updateCategorySuccess(response))
		    )
	    })
	)

    @Effect()
    deleteCategory$ = this.actions$
	.pipe(
	    ofType(DELETE_CATEGORY),
	    concatMap((action: deleteCategory) => {
		let param = {...action.payload}
		return this.http.post(this.settingService.api_base()+'/api/category/delete', param)
		    .pipe(
			catchError((error) => of(new deleteCategoryFail(error))),
			map((response: IEditCategory) => new deleteCategorySuccess(response))
		    )
	    })
	)

    @Effect()
    getCategory$ = this.actions$
	.pipe(
	    ofType(GET_CATEGORY),
	    concatMap((action: getCategory) => {
		return this.http.get(this.settingService.api_base()+'/api/category/'+action.payload.cat_id)
		    .pipe(
			catchError((error) => of(new getCategoryFail(error))),
			map((response: ICategoryInfo) => new getCategorySuccess(response))
		    )
	    })
	)

    constructor(private actions$: Actions, public http: HttpClient, private settingService: SettingService) {}
}
