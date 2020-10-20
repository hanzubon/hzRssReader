import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

@Component({
  selector: 'app-feed-searcher',
  templateUrl: './feed-searcher.component.html',
  styleUrls: ['./feed-searcher.component.scss']
})
export class FeedSearcherComponent implements OnInit, OnDestroy  {
    private _sub: Subscription = new Subscription()

    constructor(public dialog: MatDialog, private router: Router) {}

    ngOnInit() {}

    ngOnDestroy() {
	this._sub.unsubscribe();
    }

    open_search_dialog(): void {
	const dialogRef = this.dialog.open(SearchDialogComponent, {width: '300px', autoFocus: true, restoreFocus: true, data:{}})

	this._sub.add(dialogRef.afterClosed().subscribe(result => {
	    if (!!!result || !!!result.query) return;
	    console.log(result)
	    this.router.navigate(['/search', result.query])
	}))
    }
}

