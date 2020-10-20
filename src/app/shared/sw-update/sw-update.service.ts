import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class swUpdateService {
    snackbarRef: MatSnackBarRef<SimpleSnackBar>

    constructor(public updates: SwUpdate, public appRef: ApplicationRef, private snackBar: MatSnackBar) {}

    init() {
	if (!this.isEnabled()) {
	    console.log('ServiceWorker is not enabled')
	    return;
	}
	this.updates.available.subscribe(event => {
	    console.log('current version is', event.current);
	    console.log('available version is', event.available);
	    this.promptUser(event)
	});

	this.updates.activated.subscribe(event => {
	    console.log('old version was', event.previous);
	    console.log('new version is', event.current);
	})

	// Allow the app to stabilize first, before starting polling for updates with `interval()`.
	const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
	const everyHours$ = interval(60 * 60 * 1000);
	const everyHoursOnceAppIsStable$ = concat(appIsStable$, everyHours$);

	everyHoursOnceAppIsStable$.subscribe(() => {
	    console.log('sw update check')
	    this.forceCheckUpdate()
	})
    }

    forceCheckUpdate() {
	this.updates.checkForUpdate()
    }

    forceActivateUpdate() {
	console.log('Update Activate')
	this.updates.activateUpdate().then(() => document.location.reload())
    }

    promptUser(e): void {
	if(e.available) {
	    this.snackBar.open(
		'New version is available',
		'Update',
		{duration: 0}
	    ).onAction().subscribe(() => this.forceActivateUpdate())
	} else {
	    this.snackBar.open(
		'NO new version',
		'Ok'
	    )
	}
    }

    isEnabled() {
	return this.updates.isEnabled;
    }
}
