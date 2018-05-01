import {Component, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/zip';
import { RouteDataService } from '../services/route-data.service';
import { PubMonitorService } from './services/pub-monitor.service';
import {EntityNavComponent} from '../entity-nav/entity-nav.component';

@Component({
  selector: 'app-pub-monitor',
  templateUrl: './pub-monitor.component.html',
  styleUrls: ['./pub-monitor.component.scss'],
})
export class PubMonitorComponent implements OnInit, OnChanges, OnDestroy {
  clientTree;
  routeData: any = {};
  publishers: Object[] = [];

  @ViewChild(EntityNavComponent) private entityNavComp: EntityNavComponent;

  routeDataSubscription$;

  first = true;
  constructor(
    private routeDataService: RouteDataService,
    private pubMonitorService: PubMonitorService,
    public route: ActivatedRoute,
    private router: Router,
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

  ngOnChanges() {}

  ngOnInit() {
  }

  onAgencyChange(agencyId, navigate?) {
    this.first = false; // hack to call agency changes just 1 time
    this.entityNavComp.loading = true;
    this.clientTree = [];
    if (navigate) {
      this.router.navigate(['./', 'agency', agencyId], {
        relativeTo: this.route,
      });
    }
    this.pubMonitorService
      .getClientHierarchy(agencyId)
      .subscribe((res: any) => {
        this.entityNavComp.loading = false;
        this.clientTree = res.clientTree;
        this.pubMonitorService.flattenEntityTree(res.clientTree);
      }, err => {
        this.entityNavComp.loading = false;
      });
  }

  ngOnDestroy() {
    this.routeDataSubscription$.unsubscribe();
    this.routeDataService.resetContext();
  }
}
