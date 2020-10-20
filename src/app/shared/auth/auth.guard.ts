import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router, private auth: AuthService) {}

    _auth_in = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
	console.log('_auth_in', state)
	console.log(route)
	localStorage.setItem('return_to', state.url)
	if (this.auth.authenticated()) {
	    console.log('OK, logged in');
	    return true;
	} else {
	    console.log('not logged in');
	    this.router.navigate(['/login']);
	    return false;
	}
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
	return this._auth_in(route, state)
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
	return this._auth_in(route, state)
    }
}

@Injectable()
export class NoAuthGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router, private auth: AuthService) {}

    _noauth_in = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
	console.log('_noauth_in', state)
	console.log(route)
	if (this.auth.authenticated()) {
	    console.log('Already logged in, no need to login');
	    const ret_url = localStorage.getItem('return_to') || '/'
	    this.router.navigateByUrl(ret_url)
	    return false
	} else {
	    console.log('OK not logged in, need login');
	    return true
	}
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
	return this._noauth_in(route, state)
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
	return this._noauth_in(route, state)
    }
}
