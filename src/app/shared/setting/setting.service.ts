import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface ISettings {
    categories_view_mode: string;
    headlines_view_mode: string;
    theme: string;
    read_with_scroll: boolean;
    read_reach_bottom: boolean;
    button_position: number;
    api_base: string;
}

@Injectable()
export class SettingService {

    private settings: ISettings;

    public settingSubject: BehaviorSubject<ISettings>;

    getBooleanFromStorage($key, $default =  true) {
	const v = localStorage.getItem($key);
	if (typeof v === 'undefined' || v === null)
	    return $default

	return (v === 'true')
     }

    constructor() {
	this.settings = {
	    'categories_view_mode': localStorage.getItem('categories_view_mode') || 'all',
	    'headlines_view_mode': localStorage.getItem('headlines_view_mode') || 'adaptive',
	    'theme': localStorage.getItem('theme') || 'os',
	    'read_with_scroll': this.getBooleanFromStorage('read_with_scroll'),
	    'read_reach_bottom': this.getBooleanFromStorage('read_reach_bottom'),
	    'button_position': Number(localStorage.getItem('button_position')) || 50,
	    'api_base': environment.api_base || ''
	}
	this.settingSubject = new BehaviorSubject(this.settings);
    }

    getSettings(): ISettings {
	return this.settings;
    }

    setSettings(val: ISettings) {
	let self = this;
	['categories_view_mode', 'headlines_view_mode', 'theme',
	 'read_with_scroll', 'read_reach_bottom', 'button_position'].forEach(function(v) {
	    localStorage.setItem(v,val[v]);
	    self.settings[v] = val[v];
	});
	self.settingSubject.next(self.settings);
    }

    api_base(): string {
	return this.settings.api_base
    }
}
