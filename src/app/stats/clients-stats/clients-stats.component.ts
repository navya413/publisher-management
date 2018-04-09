import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatsService } from '../services/stats.service';
import { UtilService } from '../../services/util.service';
import 'rxjs/add/observable/forkJoin';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteDataService } from '../../services/route-data.service';
import { StatsPopupComponent } from '../stats-popup/stats-popup.component';
import { MatDialog } from '@angular/material';

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
    const entityId = this.routeData.params.entityId;
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
      this.breadcrumbSegments.push({ label: entityId });
      this.breadcrumbSegments.push({ label: subLevel });
    }
  }

  getStats = function() {
    this.loading = true;
    this.statsData = [];
    this.statsService.getStats(this.routeData).subscribe(
      res => {
        this.loading = false;
        res.map(entity => {
          const item = this.statsService.clientTree.filter(
            client => client.id === entity.entity,
          )[0];
          entity['name'] = item ? item['name'] : entity['entity'];
        });
        this.statsData = res;
      },
      err => {
        this.loading = false;
      },
    );
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
        routeData: this.routeData
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
