import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { versions } from '../../../environments/versions'
import { swUpdateService } from '../../shared/sw-update/sw-update.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
    public versions: any
    public swEnabled: boolean = false

    constructor(public swUpdate: swUpdateService) {}

    ngOnInit() {
	this.versions = versions
	this.swEnabled = this.swUpdate.isEnabled()
    }

    check() {
	if (!this.swEnabled) return;
	console.log('Force sw update check')
	this.swUpdate.forceCheckUpdate()
    }
}
