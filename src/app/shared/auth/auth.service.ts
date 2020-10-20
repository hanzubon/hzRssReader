import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { interval } from 'rxjs';
import Auth0Lock from 'auth0-lock';

import { environment } from '../../../environments/environment';

const AUTH0_CLIENT_ID = environment.auth_opts.client_id;
const AUTH0_DOMAIN = environment.auth_opts.domain;

const auth0Options = {
    auth: {
	redirect: true,
	redirectUrl: environment.auth_opts.redirect_url,
	responseType: 'token id_token'
    },
    autoclose: true,
    language: environment.auth_opts.language,
}

// 1時間ごとに更新してみる
const TOKEN_REFRESH_INTERVAL = 60 * 60 * 1000

@Injectable()
export class AuthService {
    // Configure Auth0
    lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, auth0Options);

    constructor(private router:Router, public jwtHelper: JwtHelperService) {
	this.lock.on('authenticated', (authResult) => {
	    const profile = this.jwtHelper.decodeToken(authResult.idToken)
	    console.log('profile', profile);
	    console.log('authenticated event', authResult);
	    console.log('OK authenticated');
	    localStorage.setItem('token', authResult.accessToken)
	    localStorage.setItem('id_token', authResult.idToken)
	    const ret_url = localStorage.getItem('return_to') || '/'
	    this.router.navigateByUrl(ret_url)
	});

	const token_refresh$ = interval(TOKEN_REFRESH_INTERVAL);

	token_refresh$.subscribe(() => {
	    if (!this.authenticated()) {
		this.logout()
		return
	    }
	    console.log('token refresh')
	    this.lock.checkSession({}, function(err, authResult) {
		if (err) {
		    console.log('token refresh error', err)
		    this.logout()
		    return
		}
		console.log('OK refreshed');
		localStorage.setItem('token', authResult.accessToken)
		localStorage.setItem('id_token', authResult.idToken)
	    })
	})
    }

    login() {
	if (this.authenticated()) {
	    const ret_url = localStorage.getItem('return_to') || '/'
	    this.router.navigateByUrl(ret_url)
	} else {
	    this.lock.show()
	}
    }

    logout() {
	console.log('removed token from localstorage');
	localStorage.removeItem('id_token');
	localStorage.removeItem('token');
	console.log('logout on auth0');
	this.lock.logout({
	    returnTo: environment.auth_opts.redirect_url,
	    clientID: environment.auth_opts.client_id
	})
    }

    authenticated() {
	console.log('Call: authenticated()')
	const token = tokenGetter()
	if (!token) return false

	console.log('expire date', this.jwtHelper.getTokenExpirationDate(token))
	console.log('decoded token', this.jwtHelper.decodeToken(token))
	if (!this.jwtHelper.isTokenExpired()) return true
	this.logout()
	return false
    }
}

export function tokenGetter() {
    return localStorage.getItem('id_token')
}
