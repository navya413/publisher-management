import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RouteDataService } from '../../services/route-data.service';
import { PubMonitorService } from '../services/pub-monitor.service';
import { EntityState, INITIAL_ENTITY_STATE } from '../../model/entity-state';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {UtilService} from "../../services/util.service";
import {forkJoin} from "rxjs/observable/forkJoin";
import {NewEntityTwo} from "../../model/new-entity-state";
import {Subject} from "rxjs/Subject";
import * as moment from 'moment';
import {LAST_30_DAYS, LAST_MONTH, LAST_WEEK, THIS_MONTH, THIS_WEEK, TODAY, YESTERDAY} from '../../date-range/presets.util';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss'],
})
export class PublishersComponent implements OnInit, OnDestroy {
  agencyId: string;
  statsData: any[];
  loading: boolean;
  routeData;

  routeDataSubscription$;
  params: EntityState;
  level: string;

  subscription1$: Subject<NewEntityTwo[]>;
  subscription2$: Subject<NewEntityTwo[]>;
  subscription3$: Subject<NewEntityTwo[]>;
  subscriptionCM$: Subject<NewEntityTwo[]>;

  childNavLinks = [];

  datePresets = [
    TODAY,
    YESTERDAY,
    THIS_WEEK,
    LAST_WEEK,
    THIS_MONTH,
    LAST_MONTH,
    LAST_30_DAYS
  ];
  minDate = moment().subtract(3, 'days');
  maxDate = moment();

  dateRange;

  constructor(
    public pubMonitorService: PubMonitorService,
    public utilService: UtilService,
    private routeDataService: RouteDataService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    this.route.url.subscribe(data => {
      const tempObj = {};
      tempObj['data'] = this.route.snapshot.data;
      tempObj['params'] = this.route.snapshot.params;
      this.routeDataService.setContext(tempObj);
    });

    this.routeDataSubscription$ = this.routeDataService.contextSubject.subscribe(
      data => {
        this.params = JSON.parse(JSON.stringify(INITIAL_ENTITY_STATE));
        Object.assign(this.params, data.params);
        this.routeData = data;
        this.level = data.data.level;
        this.getChildLinks();
        this.buildBreadcrumb();
        this.getStats();
      },
    );
  }
  ngOnInit() {
    this.dateRange = {
      startDate: THIS_MONTH.range[0],
      endDate: THIS_MONTH.range[1]
    };

    this.pubMonitorService.setDate();

    this.getStats();
  }

  statsViewChange(val) {
    this.pubMonitorService.statsView = val.value;
    this.getStats();
  }

  getChildLinks() {
    switch (this.routeData.data.level) {
      case  'agency' :
        this.childNavLinks = [
          {path: '../clients', label: 'Clients'},
          {path: '../publishers', label: 'Publishers'}
        ];
        break;
      case  'client' :
        this.childNavLinks = [
          {path: '../campaigns', label: 'Campaigns'},
          {path: '../jobgroups', label: 'Job Groups'},
          {path: '../publishers', label: 'Publishers'}
        ];
        break;
      case  'campaign' :
        this.childNavLinks = [
          {path: '../jobgroups', label: 'Job Groups'},
          {path: '../publishers', label: 'Publishers'}
        ];
        break;
      case  'jobgroup' :
        this.childNavLinks = [
          {path: '../publishers', label: 'Publishers'}
        ];
        break;
    }
  }

  buildBreadcrumb() {

  }

  getStats = function() {

    this.loading = true;
    this.statsData = [];
    const tempData = [];

    this.subscription1$ = this.pubMonitorService.getStats(this.routeData, 'joveo');
    this.subscription2$ = this.pubMonitorService.statsView === 'billing' ?
      this.pubMonitorService.getStats(this.routeData, 'joveo', 'cd') : this.pubMonitorService.getStats(this.routeData, 'pub');
    this.subscription3$ = this.pubMonitorService.statsView === 'billing' ?
      this.pubMonitorService.getStats(this.routeData, 'joveo', 'vp') : this.pubMonitorService.getStats(this.routeData, 'pub_portal');

    this.subscriptionCM$ = this.pubMonitorService.getStats(this.routeData, 'cm');

    forkJoin(this.subscription1$, this.subscription2$, this.subscription3$, this.subscriptionCM$)
    .subscribe((res: any[]) => {
      res[0].map(entity => {
        const obj = {};
        obj['entity'] = entity.pivots.pivot1;
        obj['name'] = this.pubMonitorService.entityMap[obj['entity']] || obj['entity'];
        obj['joveoStats'] = {
          clicks: entity.stats.clicks,
          applies: entity.stats.applies,
          spend: entity.stats.spend,
          botClicks: entity.stats.botClicks,
          cta: entity.stats.cta,
          latentClicks: entity.stats.latentClicks,
          duplicateClicks: entity.stats.duplicateClicks,
        };
        if (this.pubMonitorService.statsView === 'billing') {
          obj['spendStats'] = {
            mojo: entity.stats.spend
          };
        }
        tempData.push(obj);
      });

      res[1].map(entity => {
        tempData.map(stat => {
          if (stat.entity === entity.pivots.pivot1) {
            if (this.pubMonitorService.statsView === 'billing') {
              stat['spendStats']['cd'] = entity.stats.spend;
            } else {
              stat['pubStats'] = {
                clicks: entity.stats.clicks,
                applies: entity.stats.applies,
                spend: entity.stats.spend,
                botClicks: entity.stats.botClicks
              };
            }
          }
        });
      });

      res[2].map(entity => {
        tempData.map(stat => {
          if (stat.entity === entity.pivots.pivot1) {
            if (this.pubMonitorService.statsView === 'billing') {
              stat['spendStats']['vp'] = entity.stats.spend;
            } else {
              stat['pubPortalStats'] = {
                clicks: entity.stats.clicks,
                applies: entity.stats.applies,
                spend: entity.stats.spend,
                botClicks: entity.stats.botClicks
              };
            }
          }
        });
      });

      res[3].map(entity => {
        tempData.map(stat => {
          if (stat.entity === entity.pivots.pivot1) {
              stat['cmStats'] = {
                clicks: entity.stats.clicks,
                applies: entity.stats.applies,
                spend: entity.stats.spend,
                botClicks: entity.stats.botClicks
              };
          }
        });
      });
      this.loading = false;
      this.statsData = tempData;
    });
  };

  onDateRangeChange(date) {
    this.pubMonitorService.dateRange = date.value;
    this.getStats();
  }

  onDateChange(dateRange) {
    this.pubMonitorService.setDate(dateRange);
    this.getStats();
  }

  onTimezoneChange(timezoneId) {
    this.pubMonitorService.timezoneId = timezoneId;
    this.getStats();
  }

  onReload() {
    this.getStats();
  }

  ngOnDestroy() {
    this.routeDataSubscription$.unsubscribe();
    // this.subscription1$.unsubscribe();
    // this.subscription2$.unsubscribe();
    // this.subscription3$.unsubscribe();
  }
}



@Component({
  selector: 'publisher-detail-dialog',
  templateUrl: 'publisher-detail-dialog.html',
})
export class PublisherDetailDialogComponent implements OnInit{
  loading: boolean;
  chartData: any;
  params;
  constructor(
    public dialogRef: MatDialogRef<PublisherDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public pubMonitorService: PubMonitorService) { }

  ngOnInit() {
    this.params = this.composeParams();
    // this.getChartData();
  }

  getChartData() {
    // this.loading = true;
    // this.pubMonitorService.getPublisherChartData(this.params).subscribe((res: any) => {
    //   this.loading = false;
    //   if (res.success) {
    //     this.chartData = res.data;
    //   }
    // }, err => {
    //   this.loading = false;
    // });
  }

  onDateRangeChange(dateRange) {
    this.params.period = dateRange.value.days;
    this.params.startDate = dateRange.value.startDate;
    this.params.endDate = dateRange.value.endDate;

    this.getChartData();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  composeParams() {
    // const tempParams = JSON.parse(JSON.stringify(this.data.params));
    // tempParams['placementId'] = this.data.publisher.id;
    // tempParams['period'] = this.pubMonitorService.selectedDay;
    // tempParams['startDate'] = this.pubMonitorService.startDate;
    // tempParams['endDate'] = this.pubMonitorService.endDate;
    // delete tempParams.days;
    // tempParams['freq'] = 'DAILY';
    //
    // return tempParams;
  }

}
