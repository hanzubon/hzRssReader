import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from "@angular/material/sidenav";
import { SideNavService } from '../sidenav/sidenav.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-with-sidebar',
  templateUrl: './with-sidebar.component.html',
  styleUrls: ['./with-sidebar.component.scss']
})
export class WithSidebarComponent implements OnInit, OnDestroy {
    @ViewChild('sidenav', {static: true}) sidenav: MatSidenav
    navMode: any;
    mobileQuery: MediaQueryList
    private _sub: Subscription = new Subscription()

    private _mobileQueryListener: () => void;

    constructor(private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher, private sidenavService: SideNavService) {
	this.mobileQuery = media.matchMedia('(max-width: 800px)');
	this._mobileQueryListener = () => {
	    changeDetectorRef.detectChanges()
	    this.checkSidebarState()
	}
	this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
	this._sub.add(this.route.params.subscribe(params => {
	    console.log(params)
	    // ページが遷移したら モバイルレイアウトのときは サイドバー閉じる
	    this.initSidebar()
	    let list_id_type = null
	    let list_id = null
	    if (!!params['cat_id']) {
		list_id_type = 'cat';
		list_id = params['cat_id'];
	    } else if (!!params['feed_id']) {
		list_id_type = 'feed';
		list_id = params['feed_id'];
	    }
	    if (!!list_id_type && !!list_id) {
		localStorage.setItem('list_id_type', list_id_type)
		localStorage.setItem('list_id', list_id)
	    }
	}))

	this._sub.add(this.sidenavService.sidenavSubject.subscribe((command: string) => {
	    if (this.isMobile() && this.sidenav[command] && typeof this.sidenav[command] === 'function')
		this.sidenav[command]()
	}))
    }

    ngOnDestroy(): void {
	this.mobileQuery.removeListener(this._mobileQueryListener)
	this._sub.unsubscribe()
    }

    initSidebar() {
	this.checkSidebarState(true)
    }

    checkSidebarState(force: boolean = false) {
        if (this.isMobile()) {
	    this.sidebar_to_mobile(force)
        } else {
	    this.sidebar_to_desktop(force)
        }
    }

    sidebar_to_mobile(force: boolean = false): void {
	if (force || this.navMode != 'over') {
	    this.navMode = 'over';
	    this.sidenav.close()
	}
    }

    sidebar_to_desktop(force: boolean = false): void {
	if (force || this.navMode != 'side') {
	    this.navMode = 'side';
	    this.sidenav.open();
	}
    }

    isMobile() {
	return this.mobileQuery.matches
    }

    swipeLeft() {
	this.close()
    }

    swipeRight() {
	this.open()
    }

    open() {
	if (this.isMobile())
	    this.sidenav.open()
    }

    close() {
	if (this.isMobile())
	    this.sidenav.close()
    }

    toggle() {
	if (this.isMobile())
	    this.sidenav.toggle()
    }
}
