import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RouteDataService } from '../../services/route-data.service';
import { PubMonitorService } from '../services/pub-monitor.service';
import { EntityState, INITIAL_ENTITY_STATE } from '../../model/entity-state';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss'],
})
export class PublishersComponent implements OnInit, OnDestroy {
  loading: boolean;
  routeDataSubscription$;
  publisherRes: any;
  publishers: Object[] = [];
  params: EntityState;

  public typeAhead = [];
  typeAheadCtrl: FormControl;
  filteredOptions: Observable<any[]>;
  constructor(
    private pubMonitorService: PubMonitorService,
    private routeDataService: RouteDataService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
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
        this.getPublishers();
      },
    );

    this.typeAheadCtrl = new FormControl();
    this.filteredOptions = this.typeAheadCtrl.valueChanges
      .startWith(null)
      .map(query => {
        return query ? this.filterOptions(query) : this.typeAhead.slice();
      });
  }

  ngOnInit() {}

  filterOptions(name: string) {
    return this.typeAhead.filter(
      item => item.toLowerCase().indexOf(name.toLowerCase()) >= 0,
    );
  }

  getPublishers() {
    this.loading = true;
    this.publishers = [];
    this.pubMonitorService.getPublishersStats(this.params).subscribe(
      (res: any) => {
        this.loading = false;
        this.publisherRes = res.data;
        this.publishers = this.publisherRes.records;
        this.typeAhead = this.publisherRes.typeAheadData;
      },
      err => {
        this.loading = false;
      },
    );
  }

  onDateRangeChange(dateRange) {
    this.params.days = dateRange.value.days;
    this.params.startDate = dateRange.value.startDate;
    this.params.endDate = dateRange.value.endDate;

    this.getPublishers();
  }

  onSortChange(sortData) {
    this.params.sortOrder = sortData.order === -1 ? 'desc' : 'asc';
    this.params.fields = sortData.field;

    this.getPublishers();
  }

  onPageChange(pageData) {
    this.params.page = pageData.pageIndex + 1;
    this.params.limit = pageData.pageSize;

    this.getPublishers();
  }

  onQuerySearch(query) {
    this.params.query = query;

    this.params.page = INITIAL_ENTITY_STATE.page;
    this.params.limit = INITIAL_ENTITY_STATE.limit;

    this.getPublishers();
  }

  onRowClick(row) {
    const dialogRef = this.dialog.open(PublisherDetailDialogComponent, {
      width: '60vw',
      data: {
        publisher: row.data,
        params: this.params
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  ngOnDestroy() {
    this.routeDataSubscription$.unsubscribe();
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
    private pubMonitorService: PubMonitorService) { }

  ngOnInit() {
    this.params = this.composeParams();
    this.getChartData();
  }

  getChartData() {
    this.loading = true;
    this.pubMonitorService.getPublisherChartData(this.params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.chartData = res.data;
      }
    }, err => {
      this.loading = false;
    });
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
    const tempParams = JSON.parse(JSON.stringify(this.data.params));
    tempParams['placementId'] = this.data.publisher.id;
    tempParams['period'] = tempParams.days;
    delete tempParams.days;
    tempParams['freq'] = 'DAILY';

    return tempParams;
  }

}
