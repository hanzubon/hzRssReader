import { Action } from '@ngrx/store'
import { ISubscribeFeed, IFeedInfo } from './feed.reducer'

export const SUBSCRIBE_FEED = 'subscribeFeed';
export const SUBSCRIBE_FEED_SUCCESS = 'HZRSS: subscribeFeed success';
export const SUBSCRIBE_FEED_FAIL = 'HZRSS: subscribeToFeed fail';

export const UNSUBSCRIBE_FEED = 'unsubscribeFeed';
export const UNSUBSCRIBE_FEED_SUCCESS = 'HZRSS: unsubscribeFeed success';
export const UNSUBSCRIBE_FEED_FAIL = 'HZRSS: unsubscribeFeed fail';

export const UPDATE_FEED = 'updateFeed';
export const UPDATE_FEED_SUCCESS = 'HZRSS: updateFeed success';
export const UPDATE_FEED_FAIL = 'HZRSS: updateFeed fail';

export const GET_FEED = 'getFeed';
export const GET_FEED_SUCCESS = 'HZRSS: getFeed success';
export const GET_FEED_FAIL = 'HZRSS: getFeed fail';

/* HZRSS Subscribe Feed */
export class subscribeFeed implements Action {
    readonly type = SUBSCRIBE_FEED
    constructor(public payload: any) {}
}

export class subscribeFeedSuccess implements Action {
    readonly type = SUBSCRIBE_FEED_SUCCESS
    constructor(public payload: ISubscribeFeed) {}
}

export class subscribeFeedFail implements Action {
    readonly type = SUBSCRIBE_FEED_FAIL
    constructor(public payload: string) {}
}

export type Actions =
    | subscribeFeed
    | subscribeFeedSuccess
    | subscribeFeedFail

/* HZRSS Unsubscribe Feed */
export class unsubscribeFeed implements Action {
    readonly type = UNSUBSCRIBE_FEED
    constructor(public payload: any) {}
}

export class unsubscribeFeedSuccess implements Action {
    readonly type = UNSUBSCRIBE_FEED_SUCCESS
    constructor(public payload: ISubscribeFeed) {}
}

export class unsubscribeFeedFail implements Action {
    readonly type = UNSUBSCRIBE_FEED_FAIL
    constructor(public payload: string) {}
}

export type UnsubscribeActions =
    | unsubscribeFeed
    | unsubscribeFeedSuccess
    | unsubscribeFeedFail

/* HZRSS Update Feed */
export class updateFeed implements Action {
    readonly type = UPDATE_FEED
    constructor(public payload: any) {}
}

export class updateFeedSuccess implements Action {
    readonly type = UPDATE_FEED_SUCCESS
    constructor(public payload: ISubscribeFeed) {}
}

export class updateFeedFail implements Action {
    readonly type = UPDATE_FEED_FAIL
    constructor(public payload: string) {}
}

export type UpdateActions =
    | updateFeed
    | updateFeedSuccess
    | updateFeedFail

/* HZRSS get Feed */
export class getFeed implements Action {
    readonly type = GET_FEED
    constructor(public payload: any) {}
}

export class getFeedSuccess implements Action {
    readonly type = GET_FEED_SUCCESS
    constructor(public payload: IFeedInfo) {}
}

export class getFeedFail implements Action {
    readonly type = GET_FEED_FAIL
    constructor(public payload: any) {}
}

export type GetActions =
    | getFeed
    | getFeedSuccess
    | getFeedFail
