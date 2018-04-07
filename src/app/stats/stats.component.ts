import { Component, OnDestroy, OnInit } from '@angular/core';
import { UtilService } from '../services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteDataService } from '../services/route-data.service';
import { StatsService } from './services/stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit, OnDestroy {
  agencyId: string;
  clientTree: any[];
  loading: boolean;
  routeData: any = {};
  routeDataSubscription$;
  first = true;
  constructor(
    public utilService: UtilService,
    private routeDataService: RouteDataService,
    private statsService: StatsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.routeDataSubscription$ = this.routeDataService.contextSubject.subscribe(
      data => {
        this.routeData = data;
        if (data && data.params && data.params.agencyId && this.first) {
          this.onAgencyChange(data.params.agencyId);
        }
      },
    );

    this.route.url.subscribe(data => {
      const tempObj = {};
      tempObj['data'] = this.route.snapshot.data;
      tempObj['params'] = this.route.snapshot.params;
      this.routeDataService.setContext(tempObj);
    });
  }

  ngOnInit() {}

  onAgencyChange = function(agencyId, navigate?) {
    this.first = false; // hack to call agency changes just 1 time
    this.agencyId = agencyId;
    this.clientTree = [];
    if (navigate) {
      this.router.navigate(['./', 'agency', agencyId], {
        relativeTo: this.route,
      });
    }
    this.loading = true;
    this.statsService.getClientHierarchy(agencyId).subscribe(res => {
      this.loading = false;
      this.clientTree = res.clientTree;
      this.statsService.clientTree = res.clientTree;
    }, err => {
      this.loading = false;
    });
  };

  onViewChange = function(view) {
    this.router.navigate(['./', 'agency', this.agencyId, view], {
      relativeTo: this.route,
    });
  };

  ngOnDestroy() {
    this.routeDataSubscription$.unsubscribe();
    this.routeDataService.resetContext();
  }
}
