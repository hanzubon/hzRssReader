import { Action } from '@ngrx/store'
import { IItemStatus } from './item.reducer'

export const UPDATE_ITEM_STATUS = 'updateItemStatus';
export const UPDATE_ITEM_STATUS_SUCCESS = 'HZRSS: updateItemStatus success';
export const UPDATE_ITEM_STATUS_FAIL = 'HZRSS: updateItemStatus fail';

/* HZRSS Categories */
export class updateItemStatus implements Action {
    readonly type = UPDATE_ITEM_STATUS
    constructor(public payload: any) {}
}

export class updateItemStatusSuccess implements Action {
    readonly type = UPDATE_ITEM_STATUS_SUCCESS
    constructor(public payload: IItemStatus) {}
}

export class updateItemStatusFail implements Action {
    readonly type = UPDATE_ITEM_STATUS_FAIL
    constructor(public payload: string) {}
}

export type Actions =
    | updateItemStatus
    | updateItemStatusSuccess
    | updateItemStatusFail
