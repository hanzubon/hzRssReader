import { Action } from '@ngrx/store'
import { IEditCategory, ICategoryInfo } from './category.reducer'

export const UPDATE_CATEGORY = 'updateCategory';
export const UPDATE_CATEGORY_SUCCESS = 'HZRSS: updateCategory success';
export const UPDATE_CATEGORY_FAIL = 'HZRSS: updateCategory fail';

export const DELETE_CATEGORY = 'deleteCategory';
export const DELETE_CATEGORY_SUCCESS = 'HZRSS: deleteCategory success';
export const DELETE_CATEGORY_FAIL = 'HZRSS: deleteCategory fail';

export const GET_CATEGORY = 'getCategory';
export const GET_CATEGORY_SUCCESS = 'HZRSS: getCategory success';
export const GET_CATEGORY_FAIL = 'HZRSS: getCategory fail';

/* HZRSS Update Category */
export class updateCategory implements Action {
    readonly type = UPDATE_CATEGORY
    constructor(public payload: any) {}
}

export class updateCategorySuccess implements Action {
    readonly type = UPDATE_CATEGORY_SUCCESS
    constructor(public payload: IEditCategory) {}
}

export class updateCategoryFail implements Action {
    readonly type = UPDATE_CATEGORY_FAIL
    constructor(public payload: string) {}
}

export type Actions =
    | updateCategory
    | updateCategorySuccess
    | updateCategoryFail

/* HZRSS Unsubscribe Feed */
export class deleteCategory implements Action {
    readonly type = DELETE_CATEGORY
    constructor(public payload: any) {}
}

export class deleteCategorySuccess implements Action {
    readonly type = DELETE_CATEGORY_SUCCESS
    constructor(public payload: IEditCategory) {}
}

export class deleteCategoryFail implements Action {
    readonly type = DELETE_CATEGORY_FAIL
    constructor(public payload: string) {}
}

export type DeleteCatActions =
    | deleteCategory
    | deleteCategorySuccess
    | deleteCategoryFail

/* HZRSS get Category info */
export class getCategory implements Action {
    readonly type = GET_CATEGORY
    constructor(public payload: any) {}
}

export class getCategorySuccess implements Action {
    readonly type = GET_CATEGORY_SUCCESS
    constructor(public payload: ICategoryInfo) {}
}

export class getCategoryFail implements Action {
    readonly type = GET_CATEGORY_FAIL
    constructor(public payload: string) {}
}

export type GetCatActions =
    | getCategory
    | getCategorySuccess
    | getCategoryFail
