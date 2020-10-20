import { Component, OnInit, OnDestroy,  HostBinding } from '@angular/core';
import { OverlayContainer} from '@angular/cdk/overlay';
import { Subscription } from "rxjs";

import { SettingService, ISettings } from './shared/setting/setting.service';
import { swUpdateService } from './shared/sw-update/sw-update.service';
import { ActionFeedbackService } from './shared/action-feedback/action-feedback.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    @HostBinding('class') componentCssClass

    private settings
    public theme;
    private _sub: Subscription = new Subscription()

    constructor(public overlayContainer: OverlayContainer,
		private settingService: SettingService,
		public swUpdate: swUpdateService,
		private feedback: ActionFeedbackService) {}

    ngOnInit() {
	this.settings = this.settingService.getSettings()
	this.updateTheme()
	this.swUpdate.init()
	this.feedback.init()

	this._sub.add(this.settingService.settingSubject.subscribe((settings: ISettings) => {
	    if (!!!settings) return
	    console.log('Update setting')
	    this.settings = settings
	    this.updateTheme()
	}))
    }

    ngOnDestroy() {
	this._sub.unsubscribe();
    }

    updateTheme() {
	let theme
	if (this.settings.theme == 'dark' || this.settings.theme == 'light') {
	    theme = this.settings.theme
	} else {
	    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
		theme = 'light';
	    } else {
		theme = 'dark'
	    }
	}
	this.theme = 'app-'+theme+'-theme'
	this.overlayContainer.getContainerElement().classList.add(this.theme)
	this.componentCssClass = this.theme;
    }
}
