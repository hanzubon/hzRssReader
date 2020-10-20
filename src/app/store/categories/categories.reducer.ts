import { Actions, AllActions, FirstCatActions, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_ALL_SUCCESS, GET_FIRST_CATEGORY_SUCCESS } from './categories.actions'

export interface ICategory {
    id: number
    name: string
    unread?: number
}

export function categoriesReducer(state: Array<ICategory> = [], action: Actions): ICategory[] {
    switch (action.type) {
    case GET_CATEGORIES_SUCCESS:
	let ret = action.payload.concat()
	return ret
    default:
	return state
    }
}

export function categoriesAllReducer(state: Array<ICategory> = [], action: AllActions): ICategory[] {
    switch (action.type) {
    case GET_CATEGORIES_ALL_SUCCESS:
	let ret = action.payload.concat()
	return ret
    default:
	return state
    }
}

export function firstCategoryReducer(state: ICategory, action: FirstCatActions): ICategory {
    switch (action.type) {
    case GET_FIRST_CATEGORY_SUCCESS:
	return {...action.payload}
    default:
	return state
    }
}
