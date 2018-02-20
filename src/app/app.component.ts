import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  publishers: Object[] = [];

  notificationOptions;
  constructor() {
    this.notificationOptions = {
      position: ['top', 'right'],
      timeOut: 3000,
      showProgressBar: true,
      theClass: 'notification-style'
    };
  }

  ngOnInit() {

  }
}
