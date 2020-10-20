import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { IHeadlineHeadIn } from '../../../store/headlines/headlines.reducer'

@Component({
    selector: 'app-list-head',
    templateUrl: './head.component.html',
    styleUrls: ['./head.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListHeadComponent implements OnInit {
    @Input()
    head: IHeadlineHeadIn;

  constructor() { }

  ngOnInit() {
  }
}
