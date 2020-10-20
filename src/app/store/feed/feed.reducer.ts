import { SUBSCRIBE_FEED_SUCCESS, UNSUBSCRIBE_FEED_SUCCESS, UPDATE_FEED_SUCCESS, GET_FEED_SUCCESS,
	 Actions, UnsubscribeActions, UpdateActions, GetActions } from './feed.actions'

export interface ISubscribeFeed {
    status: string
    message: string
    feed_id: number
}

export interface IFeedInfo {
    id: number
    name: string
    url: string
    web_url: string
}

export function subscribefeedReducer(state: ISubscribeFeed, action: Actions): ISubscribeFeed {
    switch (action.type) {
    case SUBSCRIBE_FEED_SUCCESS:
	return {...action.payload}
    default:
	return state
    }
}

export function unsubscribefeedReducer(state: ISubscribeFeed, action: UnsubscribeActions): ISubscribeFeed {
    switch (action.type) {
    case UNSUBSCRIBE_FEED_SUCCESS:
	return {...action.payload}
    default:
	return state
    }
}

export function updatefeedReducer(state: ISubscribeFeed, action: UpdateActions): ISubscribeFeed {
    switch (action.type) {
    case UPDATE_FEED_SUCCESS:
	return {...action.payload}
    default:
	return state
    }
}

export function getfeedReducer(state: IFeedInfo, action: GetActions): IFeedInfo {
    switch (action.type) {
    case GET_FEED_SUCCESS:
	return {...action.payload}
    default:
	return state
    }
}
