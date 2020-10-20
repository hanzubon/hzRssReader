import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioButton } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { SettingService } from '../../../shared/setting/setting.service';

@Component({
    selector: 'app-config-view-body',
    templateUrl: './config-view.component.html',
    styleUrls: ['./config-view.component.scss'],
    providers:[Title]
})
export class ConfigViewComponent implements OnInit, OnDestroy {
    public settingForm: FormGroup;
    private _sub: Subscription = new Subscription()
    constructor(public fb: FormBuilder, public settingService: SettingService, private snackBar: MatSnackBar, private title: Title) {
        let st = settingService.getSettings();
	console.log(st)
	this.settingForm = fb.group({
	    'categories_view_mode': [st.categories_view_mode],
	    'headlines_view_mode': [st.headlines_view_mode],
	    'theme': [st.theme],
	    'read_with_scroll': [st.read_with_scroll],
	    'read_reach_bottom': [st.read_reach_bottom],
	    'button_position': [st.button_position]
	})
	console.log(this.settingForm)
	this.title.setTitle('View - hzRssReader')
    }

    resetButtonPosition() {
	console.log(this.settingForm)
	this.settingForm.controls.button_position.setValue(50)
    }

    ngOnInit() {
	this._sub.add(this.settingForm.valueChanges.subscribe(val => {
	    this.settingService.setSettings(val)
	    this.snackBar.open('setting updated')
	}))
    }

    ngOnDestroy() {
	this._sub.unsubscribe();
    }
}
