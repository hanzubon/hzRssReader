import { GET_HEADLINES_SUCCESS, GET_SEARCH_SUCCESS, Actions, SearchActions } from './headlines.actions'

export interface IHeadlineMeta {
    type: 'category'|'feed'|'search'
    count: number
    feed_id?: number
    cat_id?: number
    query?: string
    error?: boolean
    error_info?: string
    flatten?: boolean | string
    mode?: string
}

export interface IHeadlineHead {
    '_head': IHeadlineHeadIn
}

export interface IHeadlineHeadIn {
    id: string
    name: string
    web_url: string
}

export interface IHeadlineData {
    content: string
    feed_id: string
    guid: string
    id: number
    title: string
    link: string
    status: boolean
    pubdate: string
}

export type IHeadlineContent = IHeadlineHead | IHeadlineData

export interface IHeadline {
    meta: IHeadlineMeta
    content: Array<IHeadlineContent>
}

export function headlinesReducer(state: IHeadline, action: Actions | SearchActions): IHeadline {
    switch (action.type) {
    case GET_HEADLINES_SUCCESS:
    case GET_SEARCH_SUCCESS:
	return {...action.payload}
    default:
	return state
    }
}
