import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-about-sidebar',
    templateUrl: './about-sidebar.component.html',
    styleUrls: ['./about-sidebar.component.scss'],
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class AboutSidebarComponent implements OnInit {

    constructor() {}

    ngOnInit() {}
}
