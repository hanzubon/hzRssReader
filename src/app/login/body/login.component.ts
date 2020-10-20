import { Component, OnInit } from '@angular/core'
import { swUpdateService } from '../../shared/sw-update/sw-update.service'
import { AuthService } from '../../shared/auth/auth.service'
import { Title } from '@angular/platform-browser'
import { environment } from '../../../environments/environment'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers:[AuthService]
})
export class LoginComponent implements OnInit {
    public swEnabled: boolean = false
    public isDemoMode: boolean = false

    constructor(private auth: AuthService, public swUpdate: swUpdateService, private title: Title) {
        this.title.setTitle('Login - hzRssReader')
        this.swEnabled = this.swUpdate.isEnabled()
	this.isDemoMode = environment.demo
    }

    ngOnInit() {
        if(this.swEnabled)
            this.swUpdate.forceCheckUpdate()
    }

    login() {
        this.auth.login()
    }

    check() {
        if (!this.swEnabled) return
	console.log('Force sw update check on login')
        this.swUpdate.forceCheckUpdate()
    }
}
