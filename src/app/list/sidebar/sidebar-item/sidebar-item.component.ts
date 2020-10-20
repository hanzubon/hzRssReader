import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-sidebar-item',
    templateUrl: './sidebar-item.component.html',
    styleUrls: ['./sidebar-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarItemComponent {
    @Input()
    name: string

    @Input()
    count: number

    constructor() {}

    namefilter(name: string): string {
	return (!!name && name != '' ? name : 'NO_NAME')
    }
}
