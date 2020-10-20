import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioButton } from '@angular/material/radio';
import { Title } from '@angular/platform-browser';

import { Store } from '@ngrx/store';
import { IAppState } from '../../../store/index';
import { Observable } from 'rxjs';

import { GET_FEEDTREE } from '../../../store/feedtree/feedtree.actions';
import { IFeedTreeCategory } from '../../../store/feedtree/feedtree.reducer';

@Component({
    selector: 'app-config-feeds-body',
    templateUrl: './config-feeds.component.html',
    styleUrls: ['./config-feeds.component.scss'],
    providers:[Title]
})
export class ConfigFeedsComponent implements OnInit {
    feedtree$: Observable<IFeedTreeCategory[]>

    constructor(public fb: FormBuilder, public store: Store<IAppState>, private title:Title) {
	this.feedtree$ = this.store.select('feedtree');
	this.title.setTitle('Feeds - hzRssReader')
    }

    ngOnInit() {
	this.store.dispatch({type: GET_FEEDTREE});
    }
}
