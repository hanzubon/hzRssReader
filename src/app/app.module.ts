import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { OverlayModule} from '@angular/cdk/overlay';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { MyMaterialModule } from './material-module';

import { AppComponent } from './app.component';
import { routes } from './app.router';
import { metaReducers, reducers } from './store';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './shared/auth/auth.module';

import { CategoriesEffects, CategoriesAllEffects, FirstCategoryEffects } from './store/categories/categories.effects'
import { FeedEffects } from './store/feed/feed.effects'
import { FeedsEffects } from './store/feeds/feeds.effects'
import { FeedTreeEffects } from './store/feedtree/feedtree.effects'
import { HeadlinesEffects } from './store/headlines/headlines.effects'
import { ItemStatusEffects } from './store/item/item.effects'
import { VersionsEffects } from './store/versions/versions.effects'
import { CategoryEffects } from './store/category/category.effects'

import { LoginModule } from './login/body/login.module'
import { LoginMenuModule } from './login/menu/login-menu.module'

import { LogoutModule } from './logout//logout.module'

import { ListRedirectModule } from './list/list-redirect.module'
import { ListModule } from './list/body/list.module'
import { ListMenuModule } from './list/menu/list-menu.module'
import { ListSidebarModule } from './list/sidebar/list-sidebar.module'

import { ConfigViewModule } from './config/view/body/config-view.module'
import { ConfigViewMenuModule } from './config/view/menu/config-view-menu.module'
import { ConfigViewSidebarModule } from './config/view/sidebar/config-view-sidebar.module'

import { ConfigFeedsModule } from './config/feeds/body/config-feeds.module'
import { ConfigFeedsMenuModule } from './config/feeds/menu/config-feeds-menu.module'
import { ConfigFeedsSidebarModule } from './config/feeds/sidebar/config-feeds-sidebar.module'

import { AboutBodyModule } from './about/body/about-body.module'
import { AboutMenuModule } from './about/menu/about-menu.module'
import { AboutSidebarModule } from './about/sidebar/about-sidebar.module'

import { tokenGetter } from './shared/auth/auth.service'

@NgModule({
    declarations: [
	AppComponent
    ],
    imports: [
	BrowserAnimationsModule,
	BrowserModule,
	HammerModule,
	SharedModule,
	FormsModule,
	HttpClientModule,
	StoreModule.forRoot(reducers, { metaReducers }),
	OverlayModule,
	ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
	EffectsModule.forRoot([
	    CategoryEffects,
	    CategoriesEffects,
	    CategoriesAllEffects,
	    FirstCategoryEffects,
	    FeedEffects,
	    FeedsEffects,
	    FeedTreeEffects,
	    HeadlinesEffects,
	    ItemStatusEffects,
	    VersionsEffects
	]),
	RouterModule.forRoot(
	    routes, {
	        useHash: false
	    }
	),
	MyMaterialModule,
	JwtModule.forRoot({
	    config: {
		tokenGetter: tokenGetter,
		whitelistedDomains: environment.auth_opts.whitelistedDomains,
		blacklistedRoutes: []
	    }
	}),
	AuthModule,
	LoginModule, LoginMenuModule,
	LogoutModule,
	ListModule, ListMenuModule, ListSidebarModule, ListRedirectModule,
	ConfigViewModule, ConfigViewMenuModule, ConfigViewSidebarModule,
	ConfigFeedsModule, ConfigFeedsMenuModule, ConfigFeedsSidebarModule,
	AboutBodyModule, AboutMenuModule, AboutSidebarModule
    ],
    bootstrap: [
	AppComponent
    ]
})
export class AppModule {}
