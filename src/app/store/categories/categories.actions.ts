import { Action } from '@ngrx/store'
import { ICategory } from './categories.reducer'

export const GET_CATEGORIES = 'getCategories';
export const GET_CATEGORIES_SUCCESS = 'HZRSS: getCategories success';
export const GET_CATEGORIES_FAIL = 'HZRSS: getCategories fail';

export const GET_CATEGORIES_ALL = 'getSimpleCatList';
export const GET_CATEGORIES_ALL_SUCCESS = 'HZRSS: getSimpleCatList all success';
export const GET_CATEGORIES_ALL_FAIL = 'HZRSS: getSimpleCatList all fail';

export const GET_FIRST_CATEGORY = 'getFirstCategory';
export const GET_FIRST_CATEGORY_SUCCESS = 'HZRSS: getFirstCategory success';
export const GET_FIRST_CATEGORY_FAIL = 'HZRSS: getFirstCategory fail';

/* HZRSS Categories */
export class getCategories implements Action {
    readonly type = GET_CATEGORIES
    constructor(public payload: any) {}
}

export class getCategoriesSuccess implements Action {
    readonly type = GET_CATEGORIES_SUCCESS
    constructor(public payload: ICategory[]) {}
}

export class getCategoriesFail implements Action {
    readonly type = GET_CATEGORIES_FAIL
    constructor(public payload: string) {}
}

export type Actions =
    | getCategories
    | getCategoriesSuccess
    | getCategoriesFail

/* HZRSS Category simple list */
export class getCategoriesAll implements Action {
    readonly type = GET_CATEGORIES_ALL
     constructor(public payload: any) {}
 }

export class getCategoriesAllSuccess implements Action {
    readonly type = GET_CATEGORIES_ALL_SUCCESS
    constructor(public payload: ICategory[]) {}
 }

export class getCategoriesAllFail implements Action {
    readonly type = GET_CATEGORIES_ALL_FAIL
     constructor(public payload: string) {}
 }

export type AllActions =
    | getCategoriesAll
    | getCategoriesAllSuccess
    | getCategoriesAllFail

/* HZRSS First Category */
export class getFirstCategory implements Action {
    readonly type = GET_FIRST_CATEGORY
    constructor(public payload: any) {}
}

export class getFirstCategorySuccess implements Action {
    readonly type = GET_FIRST_CATEGORY_SUCCESS
    constructor(public payload: ICategory) {}
}

export class getFirstCategoryFail implements Action {
    readonly type = GET_FIRST_CATEGORY_FAIL
    constructor(public payload: string) {}
}

export type FirstCatActions =
    | getFirstCategory
    | getFirstCategorySuccess
    | getFirstCategoryFail

