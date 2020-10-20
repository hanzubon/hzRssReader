import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {
    constructor(private auth: AuthService) {}

    ngOnInit() {
	this.auth.logout()
    }
}
