import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-about-menu',
    templateUrl: './about-menu.component.html',
    styleUrls: ['./about-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutMenuComponent implements OnInit {

    constructor() {}

    ngOnInit() {}
}
