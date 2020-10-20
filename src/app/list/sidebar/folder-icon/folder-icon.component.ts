import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-folder-icon',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './folder-icon.component.html',
    styleUrls: ['./folder-icon.component.scss']
})
export class FolderIconComponent {
    @Input()
    state: string = 'close'

    constructor() {}
}
