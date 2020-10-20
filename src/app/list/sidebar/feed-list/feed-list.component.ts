import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { IAppState } from '../../../store/index';
import { Observable } from 'rxjs';

import { GET_FEEDS } from '../../../store/feeds/feeds.actions';
import { IFeed } from '../../../store/feeds/feeds.reducer';

@Component({
    selector: 'app-feed-list',
    templateUrl: './feed-list.component.html',
    styleUrls: ['./feed-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedListComponent implements OnInit {
    @Input()
    feeds: IFeed[]

    @Input()
    state: string

    @Input()
    feed_id: number;

    force_open: boolean = false

    constructor(public store: Store<IAppState>, private route: ActivatedRoute) {}

    ngOnInit() {}
}
