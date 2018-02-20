import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RouteDataService } from '../../services/route-data.service';
import { PubMonitorService } from '../services/pub-monitor.service';
import { EntityState, INITIAL_ENTITY_STATE } from '../../model/entity-state';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';

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
        this.publisherRes = {
          success: true,
          data: {
            records: [
              {
                id: 'Careerbuilder',
                status: 'A',
                name: 'CareerBuilder',
                stats: {
                  mojoStats: {
                    clicks: 2350,
                    applies: 0,
                    impressions: 0,
                    spent: 200.00,
                    botClicks: 2350,
                    hires: 0,
                    currency: 'USD',
                  },
                  cmStats: {
                    clicks: 1240,
                    applies: 0,
                    impressions: 0,
                    spent: 0,
                    botClicks: 0,
                    hires: 0,
                    currency: 'USD',
                  },
                  pubDataStats: {
                    clicks: 0,
                    applies: 0,
                    impressions: 0,
                    spent: 0,
                    botClicks: 0,
                    hires: 0,
                    currency: 'USD',
                  },
                  pubPortalStats: {
                    clicks: 0,
                    applies: 0,
                    impressions: 0,
                    spent: 0,
                    botClicks: 0,
                    hires: 0,
                    currency: 'USD',
                  },
                },
                discrepancyCmAndPubData: {
                  clicks: 0,
                  applies: 0,
                  impressions: 0,
                  spent: 0,
                  botClicks: 0,
                  hires: 0,
                  currency: 'USD',
                },
                discrepancyMojoAndPubData: {
                  clicks: 0,
                  applies: 0,
                  impressions: 0,
                  spent: 0,
                  botClicks: 0,
                  hires: 0,
                  currency: 'USD',
                },
                discrepancyMojoAndPubPortal: {
                  clicks: 0,
                  applies: 0,
                  impressions: 0,
                  spent: 0,
                  botClicks: 0,
                  hires: 0,
                  currency: 'USD',
                },
              },
              {
                id: 'LinkedIn(LimitedListings)',
                status: 'A',
                name: 'LinkedIn(LimitedListings)',
                stats: {
                  mojoStats: {
                    clicks: 0,
                    applies: 0,
                    impressions: 0,
                    spent: 0,
                    botClicks: 0,
                    hires: 0,
                    currency: 'USD',
                  },
                  cmStats: {
                    clicks: 0,
                    applies: 0,
                    impressions: 0,
                    spent: 0,
                    botClicks: 0,
                    hires: 0,
                    currency: 'USD',
                  },
                  pubDataStats: {
                    clicks: 0,
                    applies: 0,
                    impressions: 0,
                    spent: 0,
                    botClicks: 0,
                    hires: 0,
                    currency: 'USD',
                  },
                  pubPortalStats: {
                    clicks: 0,
                    applies: 0,
                    impressions: 0,
                    spent: 0,
                    botClicks: 0,
                    hires: 0,
                    currency: 'USD',
                  },
                },
                discrepancyCmAndPubData: {
                  clicks: 0,
                  applies: 0,
                  impressions: 0,
                  spent: 0,
                  botClicks: 0,
                  hires: 0,
                  currency: 'USD',
                },
                discrepancyMojoAndPubData: {
                  clicks: 0,
                  applies: 0,
                  impressions: 0,
                  spent: 0,
                  botClicks: 0,
                  hires: 0,
                  currency: 'USD',
                },
                discrepancyMojoAndPubPortal: {
                  clicks: 0,
                  applies: 0,
                  impressions: 0,
                  spent: 0,
                  botClicks: 0,
                  hires: 0,
                  currency: 'USD',
                },
              },
              {
                id: 'Indeed Campaign',
                status: 'A',
                name: 'Indeed Campaign',
                stats: {
                  mojoStats: {
                    clicks: 0,
                    applies: 0,
                    impressions: 0,
                    spent: 0,
                    botClicks: 0,
                    hires: 0,
                    currency: 'USD',
                  },
                  cmStats: {
                    clicks: 0,
                    applies: 0,
                    impressions: 0,
                    spent: 0,
                    botClicks: 0,
                    hires: 0,
                    currency: 'USD',
                  },
                  pubDataStats: {
                    clicks: 0,
                    applies: 0,
                    impressions: 0,
                    spent: 0,
                    botClicks: 0,
                    hires: 0,
                    currency: 'USD',
                  },
                  pubPortalStats: {
                    clicks: 0,
                    applies: 0,
                    impressions: 0,
                    spent: 0,
                    botClicks: 0,
                    hires: 0,
                    currency: 'USD',
                  },
                },
                discrepancyCmAndPubData: {
                  clicks: 0,
                  applies: 0,
                  impressions: 0,
                  spent: 0,
                  botClicks: 0,
                  hires: 0,
                  currency: 'USD',
                },
                discrepancyMojoAndPubData: {
                  clicks: 0,
                  applies: 0,
                  impressions: 0,
                  spent: 0,
                  botClicks: 0,
                  hires: 0,
                  currency: 'USD',
                },
                discrepancyMojoAndPubPortal: {
                  clicks: 0,
                  applies: 0,
                  impressions: 0,
                  spent: 0,
                  botClicks: 0,
                  hires: 0,
                  currency: 'USD',
                },
              },
            ],
            summary: {
              name: 'Totals',
              totalPlacements: 16,
              clicks: 0,
              botClicks: 0,
              applies: 0,
              spent: '0.00',
              cta: '0.00',
              cpc: '0.00',
              cpa: '0.00',
              sponsoredJobs: 0,
            },
            typeAheadData: [
              'LinkedIn(LimitedListings)',
              'Indeed Campaign',
              'Snagajob Postings',
              'CareerBuilder',
              'Glassdoor-DirectEmployers',
              'JobCase Postings',
              'Glassdoor – Organic',
              'ZipRecruiter-DirectEmployer',
              'Joveo Exchange',
              'DirectEmployers.org Postings',
              'Nexxt Posting',
              'Indeed-bid',
              'Glassdoor Postings',
              'LinkedIn Postings',
              'Indeed-organic',
              'Appcast',
            ],
          },
        };
        this.publishers = this.publisherRes.data.records;
        this.typeAhead = this.publisherRes.typeAheadData;
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

  rowExpanded(val) {

  }

  rowCollapsed(val) {
    console.log(val);
  }

  ngOnDestroy() {
    this.routeDataSubscription$.unsubscribe();
  }
}
