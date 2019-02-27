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

  childNavLinks = [];

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
      },
    );
  }
  ngOnInit() {
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

  ngOnDestroy() {
    this.routeDataSubscription$.unsubscribe();
  }
}
