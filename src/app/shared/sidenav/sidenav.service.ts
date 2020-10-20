import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SideNavService {
    public sidenavSubject: BehaviorSubject<string>;

    constructor() {
        this.sidenavSubject = new BehaviorSubject('init');
    }

    open() {
	this.sidenavSubject.next('open')
    }

    close() {
	this.sidenavSubject.next('close')
    }

    toggle() {
	this.sidenavSubject.next('toggle')
    }
}
