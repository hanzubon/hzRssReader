import { Component, ChangeDetectionStrategy } from '@angular/core'
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-about-body',
    templateUrl: './about-body.component.html',
    styleUrls: ['./about-body.component.scss'],
    changeDetection:ChangeDetectionStrategy.OnPush,
    providers:[Title]
})
export class AboutBodyComponent {
    constructor(private title: Title) {
	this.title.setTitle('About - hzRssReader')
    }
}
