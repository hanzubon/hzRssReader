import { Route } from '@angular/router'
import { AuthGuard, NoAuthGuard } from './shared/auth/auth.guard'

import { NoSidebarComponent } from './shared/no-sidebar/no-sidebar.component'
import { WithSidebarComponent } from './shared/with-sidebar/with-sidebar.component'

import { LoginComponent } from './login/body/login.component'
import { LoginMenuComponent } from './login/menu/login-menu.component'

import { LogoutComponent } from './logout/logout.component'

import { ListRedirectComponent } from './list/list-redirect.component'
import { ListComponent } from './list/body/list.component'
import { ListMenuComponent } from './list/menu/list-menu.component'
import { ListSidebarComponent } from './list/sidebar/list-sidebar.component'

import { ConfigViewComponent } from './config/view/body/config-view.component'
import { ConfigViewMenuComponent } from './config/view/menu/config-view-menu.component'
import { ConfigViewSidebarComponent } from './config/view/sidebar/config-view-sidebar.component'

import { ConfigFeedsComponent } from './config/feeds/body/config-feeds.component'
import { ConfigFeedsMenuComponent } from './config/feeds/menu/config-feeds-menu.component'
import { ConfigFeedsSidebarComponent } from './config/feeds/sidebar/config-feeds-sidebar.component'

import { AboutBodyComponent } from './about/body/about-body.component'
import { AboutMenuComponent } from './about/menu/about-menu.component'
import { AboutSidebarComponent } from './about/sidebar/about-sidebar.component'


export const routes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: 'list'},
    { path: 'login', pathMatch: 'full',
      canActivate: [NoAuthGuard], canActivateChild: [NoAuthGuard],
      component: NoSidebarComponent,
      children: [
	  { path : '', component: LoginComponent, outlet: 'body'},
	  { path : '', component: LoginMenuComponent, outlet: 'menu'}
      ]
    },
    { path: 'logout', component: LogoutComponent},
    { path: 'list', pathMatch: 'full',
      canActivate: [AuthGuard], canActivateChild: [AuthGuard],
      component: ListRedirectComponent},
    { path: 'list/:cat_id', canActivate: [AuthGuard], canActivateChild: [AuthGuard], component: WithSidebarComponent,
      children: [
	  { path : '', component: ListComponent, outlet: 'body'},
	  { path : '', component: ListSidebarComponent, outlet: 'sidebar'},
	  { path : '', component: ListMenuComponent, outlet: 'menu'}
      ]
    },
    { path: 'list/feed/:feed_id', canActivate: [AuthGuard], canActivateChild: [AuthGuard], component: WithSidebarComponent,
      children: [
	  { path : '', component: ListComponent, outlet: 'body'},
	  { path : '', component: ListSidebarComponent, outlet: 'sidebar'},
	  { path : '', component: ListMenuComponent, outlet: 'menu'}
      ]
    },
    { path: 'search/:query', canActivate: [AuthGuard], canActivateChild: [AuthGuard], component: WithSidebarComponent,
      children: [
	  { path : '', component: ListComponent, outlet: 'body'},
	  { path : '', component: ListSidebarComponent, outlet: 'sidebar'},
	  { path : '', component: ListMenuComponent, outlet: 'menu'}
      ]
    },
    { path: 'config', pathMatch: 'full', redirectTo: 'config/view'},
    { path: 'config/view', canActivate: [AuthGuard], canActivateChild: [AuthGuard], component: WithSidebarComponent,
      children: [
	  { path : '', component: ConfigViewComponent, outlet: 'body'},
	  { path : '', component: ConfigViewSidebarComponent, outlet: 'sidebar'},
	  { path : '', component: ConfigViewMenuComponent, outlet: 'menu'}
      ]
    },
    { path: 'config/feeds', canActivate: [AuthGuard], canActivateChild: [AuthGuard], component: WithSidebarComponent,
      children: [
	  { path : '', component: ConfigFeedsComponent, outlet: 'body'},
	  { path : '', component: ConfigFeedsSidebarComponent, outlet: 'sidebar'},
	  { path : '', component: ConfigFeedsMenuComponent, outlet: 'menu'}
      ]
    },
    { path: 'about', canActivate: [AuthGuard], canActivateChild: [AuthGuard], component: WithSidebarComponent,
      children: [
	  { path : '', component: AboutBodyComponent, outlet: 'body'},
	  { path : '', component: AboutSidebarComponent, outlet: 'sidebar'},
	  { path : '', component: AboutMenuComponent, outlet: 'menu'}
      ]
    }
]
