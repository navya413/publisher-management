import { Component, OnInit } from '@angular/core';
import { PubFeedsService } from '../services/pub-feeds.service';
import * as moment from 'moment';
import {UtilService} from "../../services/util.service";

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
  selectedPublisher: string;
  constructor(private pubFeedsService: PubFeedsService, private utilService: UtilService) {}

  ngOnInit() {
    this.utilService.getFtpPublishersList().subscribe(res => {
      this.ftpPublishers = res;
      if (this.ftpPublishers && this.ftpPublishers.length) {
        this.selectedPublisher = this.ftpPublishers[0];
        this.onPublisherChange(this.selectedPublisher);
      }
    });
  }

  onPublisherChange(selectPub) {
    this.loading = true;
    this.alerts = [];
    this.pubFeedsService.getPublisherAlerts(selectPub).subscribe(res => {
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
    return (row[col.field]) ? moment(row[col.field] * 1000).format('MM-DD-YYYY h:mm:ss') : '--';
  }
}
