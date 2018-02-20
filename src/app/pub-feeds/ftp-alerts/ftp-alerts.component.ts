import { Component, OnInit } from '@angular/core';
import { PubFeedsService } from '../services/pub-feeds.service';
import * as moment from 'moment';

@Component({
  selector: 'app-ftp-alerts',
  templateUrl: './ftp-alerts.component.html',
  styleUrls: ['./ftp-alerts.component.scss'],
})
export class FtpAlertsComponent implements OnInit {
  ftpPublishers: string[];
  alertResp: any;
  alerts;
  loading: boolean;
  constructor(private pubFeedsService: PubFeedsService) {}

  ngOnInit() {
    this.pubFeedsService.getFtpPublishersTypeahead().subscribe(
      (res: any) => {
        this.ftpPublishers = res;
      },
      err => {
        this.ftpPublishers = ['LinkedIn', 'Bayard'];
      },
    );
  }

  onPublisherChange(selectObj) {
    this.loading = true;
    this.alerts = [];
    this.pubFeedsService.getPublisherAlerts(selectObj.value).subscribe(res => {
      this.loading = false;
      this.alertResp = res;
      if (this.alertResp.length) {
        this.alerts = this.alertResp[0].alerts;
      }
    }, err => {
      this.loading = false;
    });
    console.log(this.alerts);
  }

  getDate(row, col) {
    return (row[col.field]) ? moment(row[col.field]).format('MM-DD-YYYY h:mm:ss') : '--';
  }
}
