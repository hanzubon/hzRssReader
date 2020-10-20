import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../environments/environment';

import { categoriesReducer, categoriesAllReducer, firstCategoryReducer, ICategory } from './categories/categories.reducer';
import { updateCategoryReducer, deleteCategoryReducer, getCategoryReducer,
	 IEditCategory, ICategoryInfo } from './category/category.reducer';
import { feedsReducer, IFeed } from './feeds/feeds.reducer';
import { headlinesReducer, IHeadline } from './headlines/headlines.reducer';
import { subscribefeedReducer, unsubscribefeedReducer, updatefeedReducer, getfeedReducer,
	 ISubscribeFeed, IFeedInfo} from './feed/feed.reducer';
import { feedtreeReducer, IFeedTreeCategory } from './feedtree/feedtree.reducer';
import { itemReducer, IItemStatus } from './item/item.reducer';
import { versionsReducer, IVersions } from './versions/versions.reducer';

// all new reducers should be define here
export interface IAppState {
    categories: ICategory[];
    categoriesall: ICategory[];
    firstcategory: ICategory;
    updatecategory: IEditCategory;
    deletecategory: IEditCategory;
    getcategory: ICategoryInfo;
    feeds: IFeed[];
    headlines: IHeadline;
    subscribefeed: ISubscribeFeed;
    unsubscribefeed: ISubscribeFeed;
    updatefeed: ISubscribeFeed;
    feedtree: IFeedTreeCategory[];
    getfeed: IFeedInfo;
    item: IItemStatus;
    versions: IVersions
}

// all new reducers should be define here
export const reducers: ActionReducerMap<IAppState> = {
    categories: categoriesReducer,
    categoriesall: categoriesAllReducer,
    firstcategory: firstCategoryReducer,
    updatecategory: updateCategoryReducer,
    deletecategory: deleteCategoryReducer,
    getcategory: getCategoryReducer,
    feeds: feedsReducer,
    headlines: headlinesReducer,
    subscribefeed: subscribefeedReducer,
    unsubscribefeed: unsubscribefeedReducer,
    updatefeed: updatefeedReducer,
    getfeed: getfeedReducer,
    feedtree: feedtreeReducer,
    item: itemReducer,
    versions: versionsReducer
}

// console.log all actions
export function logger(reducer: ActionReducer<IAppState>): ActionReducer<any, any> {
    return function(state: IAppState, action: any): IAppState {
	console.log('state', state);
	console.log('action', action);
	return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-re
ducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<IAppState>[] = !environment.production
  ? [logger, storeFreeze]
  : [];
