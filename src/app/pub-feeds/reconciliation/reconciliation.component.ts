import { Component, OnInit } from '@angular/core';
import { PubFeedsService } from '../services/pub-feeds.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reconciliation',
  templateUrl: './reconciliation.component.html',
  styleUrls: ['./reconciliation.component.scss'],
})
export class ReconciliationComponent implements OnInit {
  loading: boolean;
  placements = [];
  constructor(private pubFeedsService: PubFeedsService) {}

  ngOnInit() {
    this.getReconciliationDetails();
  }

  getReconciliationDetails() {
    this.placements = [];
    this.loading = true;
    this.pubFeedsService.getReconciliationDetails().subscribe(
      (res: any) => {
        this.loading = false;
        this.placements = res.data.records;
        console.log(res);
      },
      err => {
        this.loading = false;
      },
    );
  }

  getFailurePer(row) {
    return row['totalRecords'] ? Number.parseFloat((row['unParsableLines'] / row['totalRecords'] * 100).toFixed(2)) : 0;
  }

  getFormatedDate(row) {
    return moment(row.uploadTime).format('MM/DD/YYYY HH:mm');
  }

  onReload() {
    this.getReconciliationDetails();
  }
}
