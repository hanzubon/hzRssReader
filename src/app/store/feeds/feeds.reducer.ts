import { GET_FEEDS_SUCCESS, Actions } from './feeds.actions';

export interface IFeed {
    cat_id: number
    id: number
    name: string
    unread: number
}

export function feedsReducer(state: Array<IFeed> = [], action: Actions): IFeed[] {
    switch (action.type) {
    case GET_FEEDS_SUCCESS:
	return action.payload.concat()
    default:
	return state;
    }
};
