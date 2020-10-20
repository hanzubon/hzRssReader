import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-config-sidebar',
    templateUrl: './config-sidebar.component.html',
    styleUrls: ['./config-sidebar.component.scss']
})
export class ConfigSidebarComponent implements OnInit {
    @Input()
    public active: string;

    constructor() {}

    ngOnInit() {}
}
