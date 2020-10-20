import { Actions, UPDATE_ITEM_STATUS_SUCCESS } from './item.actions'

export interface IItemStatus {
    id: number[]
    status: boolean
    info: any;
    result: boolean
}

export function itemReducer(state: IItemStatus, action: Actions): IItemStatus {
    switch (action.type) {
    case UPDATE_ITEM_STATUS_SUCCESS:
	return {...action.payload}
    default:
	return state
    }
}
