import { Action } from '@ngrx/store'
import { IFeedTreeCategory } from './feedtree.reducer'

export const GET_FEEDTREE = 'getFeedTree'
export const GET_FEEDTREE_SUCCESS = 'HZRSS: getFeedTree success'
export const GET_FEEDTREE_FAIL = 'HZRSS: getFeedTree fail'

/* GET Feedtree */
export class getFeedTree implements Action {
    readonly type = GET_FEEDTREE
    constructor(public payload: any) {}
}

export class getFeedTreeSuccess implements Action {
    readonly type = GET_FEEDTREE_SUCCESS
    constructor(public payload: IFeedTreeCategory[]) {}
}

export class getFeedTreeFail implements Action {
    readonly type = GET_FEEDTREE_FAIL
    constructor(public payload: string) {}
}

export type Actions =
    | getFeedTree
    | getFeedTreeSuccess
    | getFeedTreeFail
