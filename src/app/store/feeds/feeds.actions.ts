import { Action } from '@ngrx/store'
import { IFeed } from './feeds.reducer'
import { IApiResp } from '../common/api.common'

export const GET_FEEDS = 'getFeeds'
export const GET_FEEDS_SUCCESS = 'TTRSS: getFeeds success'
export const GET_FEEDS_FAIL = 'TTRSS: getFeeds fail'

/* Get Feeds */
export class getFeeds implements Action {
    readonly type = GET_FEEDS
    constructor(public payload: any) {}
}

export class getFeedsSuccess implements Action {
    readonly type = GET_FEEDS_SUCCESS
    constructor(public payload: IFeed[]) {}
}

export class getFeedsFail implements Action {
    readonly type = GET_FEEDS_FAIL
    constructor(public payload: string) {}
}

export type Actions =
    | getFeeds
    | getFeedsSuccess
    | getFeedsFail
