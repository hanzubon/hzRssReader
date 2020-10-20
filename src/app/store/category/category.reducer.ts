import { UPDATE_CATEGORY_SUCCESS, DELETE_CATEGORY_SUCCESS, GET_CATEGORY_SUCCESS, Actions, DeleteCatActions, GetCatActions } from './category.actions'

export interface IEditCategory {
    status: string
    message: string
    cat_id?: number
}

export interface ICategoryInfo {
    id: number
    name: string
}

export function updateCategoryReducer(state: IEditCategory, action: Actions): IEditCategory {
    switch (action.type) {
    case UPDATE_CATEGORY_SUCCESS:
        return {...action.payload}
    default:
	return state
    }
}

export function deleteCategoryReducer(state: IEditCategory, action: DeleteCatActions): IEditCategory {
    switch (action.type) {
    case DELETE_CATEGORY_SUCCESS:
        return {...action.payload}
    default:
	return state
    }
}

export function getCategoryReducer(state: ICategoryInfo, action: GetCatActions): ICategoryInfo {
    switch (action.type) {
    case GET_CATEGORY_SUCCESS:
        return {...action.payload}
    default:
	return state
    }
}
