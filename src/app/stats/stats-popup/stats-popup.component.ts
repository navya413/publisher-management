import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { StatsService } from '../services/stats.service';
import {NewEntity} from "../../model/new-entity-state";

@Component({
  selector: 'app-stats-popup',
  templateUrl: './stats-popup.component.html',
  styleUrls: ['./stats-popup.component.scss'],
})
export class StatsPopupComponent implements OnInit {
  loading: boolean;
  chartData: any;
  constructor(
    public dialogRef: MatDialogRef<StatsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private statsService: StatsService,
  ) {}

  ngOnInit() {
    this.getDailyStats();
  }

  getDailyStats() {
    this.loading = true;
    this.statsService
      .getDailyStats(this.data.routeData, this.data.row.entity)
      .subscribe(
        (res: NewEntity[]) => {
          this.loading = false;
          this.chartData = res;
        },
        err => {
          this.loading = false;
        },
      );
  }
}
