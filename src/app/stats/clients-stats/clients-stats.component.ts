import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatsService } from '../services/stats.service';
import { UtilService } from '../../services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteDataService } from '../../services/route-data.service';
import { StatsPopupComponent } from '../stats-popup/stats-popup.component';
import { MatDialog } from '@angular/material';
import { NewEntity, NewEntityTwo } from '../../model/new-entity-state';
import { Subject } from 'rxjs/Subject';
import {forkJoin} from "rxjs/observable/forkJoin";
import 'rxjs/add/operator/map'
@Component({
  selector: 'app-clients-stats',
  templateUrl: './clients-stats.component.html',
  styleUrls: ['./clients-stats.component.scss'],
})
export class ClientsStatsComponent implements OnDestroy {
  agencyId: string;
  timezoneId: string;
  statsData: any[];
  loading: boolean;
  routeData;

  routeDataSubscription$;
  urlSubscription$;

  breadcrumbSegments;

  cmStatsSubscription$: Subject<NewEntityTwo[]>;
  joveoStatsSubscription$: Subject<NewEntityTwo[]>;
  pubStatsSubscription$: Subject<NewEntityTwo[]>;

  constructor(
    private statsService: StatsService,
    public utilService: UtilService,
    private routeDataService: RouteDataService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    this.urlSubscription$ = this.route.url.subscribe(data => {
      const tempObj = {};
      tempObj['data'] = this.route.snapshot.data;
      tempObj['params'] = this.route.snapshot.params;
      this.routeDataService.setContext(tempObj);
    });

    this.routeDataSubscription$ = this.routeDataService.contextSubject.subscribe(
      data => {
        this.routeData = data;
        this.buildBreadcrumb();
        this.getStats();
      },
    );
  }

  buildBreadcrumb() {
    const level = this.routeData.data.level;
    const subLevel = this.routeData.data.subLevel;

    const agencyId = this.routeData.params.agencyId;
    this.breadcrumbSegments = [];

    const segment = { label: null, url: null };
    if (subLevel) {
      segment['url'] = '../';
    }

    switch (level) {
      case 'clients':
        segment['label'] = 'Clients';
        this.breadcrumbSegments.push(segment);
        break;
      case 'publishers':
        segment['label'] = 'Publishers';
        this.breadcrumbSegments.push(segment);
        break;
    }

    if (subLevel) {
      const entityId =
        this.statsService.clientMap[this.routeData.params.entityId] ||
        this.routeData.params.entityId;
      this.breadcrumbSegments.push({ label: entityId });
      this.breadcrumbSegments.push({ label: subLevel });
    }
  }

  getStats = function() {
    const level = this.routeData.data.level;
    this.loading = true;
    this.statsData = [];
    const tempData = [];

    this.cmStatsSubscription$ = this.statsService.getCMStats(level);
    this.joveoStatsSubscription$ = this.statsService.getJoveoStats(level);
    this.pubStatsSubscription$ = this.statsService.getPubStats(level);

    forkJoin(this.cmStatsSubscription$, this.joveoStatsSubscription$, this.pubStatsSubscription$).subscribe((res: any[]) => {
      res[0].map(entity => {
        const obj = {};
        obj['entity'] = entity.pivots.pivot1;
        obj['name'] = this.statsService.clientMap[obj['entity']] || obj['entity'];
        obj['cmStats'] = {
          clicks: entity.stats.clicks,
          applies: entity.stats.applies,
          spend: entity.stats.spend,
          botClicks: entity.stats.botClicks
        };
        obj['spendMojo'] = entity.stats.spendMojo;
        obj['spendCD'] = entity.stats.spendCD;
        obj['spendPubPortal'] = entity.stats.spendPubPortal;
        obj['spendSelfServe'] = entity.stats.spendSelfServe;
        tempData.push(obj);
      });

      res[1].map(entity => {
        tempData.map(stat => {
          if (stat.entity === entity.pivots.pivot1) {
            stat['joveoStats'] = {
              clicks: entity.stats.clicks,
              applies: entity.stats.applies,
              spend: entity.stats.spend,
              botClicks: entity.stats.botClicks
            };
          }
        });
      });

      res[2].map(entity => {
        tempData.map(stat => {
          if (stat.entity === entity.pivots.pivot1) {
            stat['pubStats'] = {
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
    this.statsService.dateRange = date.value;
    this.getStats();
  }

  onTimezoneChange(timezoneId) {
    this.statsService.timezoneId = timezoneId;
    this.getStats();
  }

  onRowClick(row) {
    const dialogRef = this.dialog.open(StatsPopupComponent, {
      width: '80vw',
      data: {
        row: row.data,
        routeData: this.routeData,
      },
    });
  }

  onReload() {
    this.getStats();
  }

  ngOnDestroy() {
    if (this.routeDataSubscription$) {
      this.routeDataSubscription$.unsubscribe();
    }
    if (this.urlSubscription$) {
      this.urlSubscription$.unsubscribe();
    }
  }
}
