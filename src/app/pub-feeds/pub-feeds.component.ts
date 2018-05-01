import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pub-feeds',
  templateUrl: './pub-feeds.component.html',
  styleUrls: ['./pub-feeds.component.scss']
})
export class PubFeedsComponent implements OnInit {

  navLinks = [{
    path: 'ftp-management',
    label: 'FTP Management'
  }, {
    path: 'ftp-alerts',
    label: 'FTP Alerts'
  }, {
    path: 'reconciliation',
    label: 'Reconciliation Monitoring'
  }];
  constructor() { }

  ngOnInit() {
  }

}
