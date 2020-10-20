import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-login-menu',
    templateUrl: './login-menu.component.html',
    styleUrls: ['./login-menu.component.scss'],
    providers:[Title]
})
export class LoginMenuComponent implements OnInit {

    constructor(private title: Title) {
	this.title.setTitle('Login - hzRssReader')
    }

    ngOnInit() {}
}
