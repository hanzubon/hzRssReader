import { Action } from '@ngrx/store'
import { IHeadline } from './headlines.reducer'

export const GET_HEADLINES = 'getHeadlines';
export const GET_HEADLINES_SUCCESS = 'HZRSS: getHeadlines success';
export const GET_HEADLINES_FAIL = 'HZRSS: getHeadlines fail';

export const GET_SEARCH = 'Search';
export const GET_SEARCH_SUCCESS = 'HZRSS: Search success';
export const GET_SEARCH_FAIL = 'HZRSS: Search fail';

/* GET Headlines */
export class getHeadlines implements Action {
    readonly type = GET_HEADLINES
    constructor(public payload: any) {}
}

export class getHeadlinesSuccess implements Action {
    readonly type = GET_HEADLINES_SUCCESS
    constructor(public payload: IHeadline) {}
}

export class getHeadlinesFail implements Action {
    readonly type = GET_HEADLINES_FAIL
    constructor(public payload: string) {}
}

export type Actions =
    | getHeadlines
    | getHeadlinesSuccess
    | getHeadlinesFail

/* Search */
export class getSearch implements Action {
    readonly type = GET_SEARCH
    constructor(public payload: any) {}
}

export class getSearchSuccess implements Action {
    readonly type = GET_SEARCH_SUCCESS
    constructor(public payload: IHeadline) {}
}

export class getSearchFail implements Action {
    readonly type = GET_SEARCH_FAIL
    constructor(public payload: string) {}
}

export type SearchActions =
    | getSearch
    | getSearchSuccess
    | getSearchFail
