import { GET_FEEDTREE_SUCCESS, Actions } from './feedtree.actions'

export interface IFeedTreeCategory {
    category_id: number
    category_name: string
    feeds: IFeedTreeFeed[]
}

export interface IFeedTreeFeed {
    id: number
    name: string
    web_url: string
    feed_url: string
}

export function feedtreeReducer(state: Array<IFeedTreeCategory> = [], action: Actions): IFeedTreeCategory[] {
    switch (action.type) {
    case GET_FEEDTREE_SUCCESS:
	return action.payload.concat()
    default:
	return state
    }
}
