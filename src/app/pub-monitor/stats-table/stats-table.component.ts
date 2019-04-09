import {Component, DoCheck, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { UtilService } from '../../services/util.service';
import {PubMonitorService} from "../services/pub-monitor.service";
import {forkJoin} from 'rxjs/observable/forkJoin';
import {Subject} from 'rxjs/Subject';
import {NewEntityTwo} from '../../model/new-entity-state';
import {LAST_30_DAYS, LAST_MONTH, LAST_WEEK, THIS_MONTH, THIS_WEEK, TODAY, YESTERDAY} from '../../date-range/presets.util';
import * as moment from 'moment';
import {DataTable} from 'momentum-table';

@Component({
  selector: 'app-stats-table',
  templateUrl: './stats-table.component.html',
  styleUrls: ['./stats-table.component.scss'],
})
export class StatsTableComponent implements OnInit {
  @Input() title;
  @Input() routeData;

  @Input() disableLink;
  @Input() disableClick;

  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() reload: EventEmitter<any> = new EventEmitter<any>();

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

  statsData;
  allStatsData;
  loading: boolean;
  subscription1$: Subject<NewEntityTwo[]>;
  subscription2$: Subject<NewEntityTwo[]>;
  subscription3$: Subject<NewEntityTwo[]>;
  subscriptionCM$: Subject<NewEntityTwo[]>;

  compareMenu = null;
  compareMenus = {
    clicks: {
      0: ['Pub Rec Clicks', 'CM Clicks'],
      1: ['Joveo Clicks', 'CM Clicks'],
      2: ['Joveo Clicks', 'Pub Rec Clicks'],

      3: ['Pub Rec Clicks', 'Joveo Clicks'],
      4: ['CM Clicks', 'Joveo Clicks'],
      5: ['CM Clicks', 'Pub Rec Clicks']
    },
    spend: {
      0: ['Pub Rec Spend', 'Webscrape Spend'],
      1: ['Joveo Spend', 'Webscrape Spend'],
      2: ['Joveo Spend', 'Pub Rec Spend'],

      3: ['Pub Rec Spend', 'Joveo Spend'],
      4: ['Webscrape Spend', 'Joveo Spend'],
      5: ['Webscrape Spend', 'Pub Rec Spend']
    }
  };
  fieldMapper = {
    joveoToPubClicksDiscr: this.compareMenus.clicks[2],
    pubToCMClicksDiscr: this.compareMenus.clicks[0],
    joveoToCMClicksDiscr: this.compareMenus.clicks[1],
    pubToJoveoClicksDiscr: this.compareMenus.clicks[3],
    cmToJoveoClicksDiscr: this.compareMenus.clicks[4],
    cmToPubClicksDiscr: this.compareMenus.clicks[5],
    joveoToPubSpendDiscr: this.compareMenus.spend[2],
    pubToWebscrapedSpendDiscr: this.compareMenus.spend[0],
    joveoToWebscrapedSpendDiscr: this.compareMenus.spend[1],
    pubToJoveoSpendDiscr: this.compareMenus.spend[3],
    webscrapedToJoveoSpendDiscr: this.compareMenus.spend[4],
    webscrapedToPubSpendDiscr: this.compareMenus.spend[5]
  };
  labelToShow = {
    clicks: {
      joveoToPubClicksDiscr: 'Joveo vs Pub Rec',
      pubToCMClicksDiscr: 'Pub Rec vs CM',
      joveoToCMClicksDiscr: 'Jove vs CM',
      pubToJoveoClicksDiscr: 'Pub Rec vs Joveo',
      cmToJoveoClicksDiscr: 'CM vs Joveo',
      cmToPubClicksDiscr: 'CM vs Pub Rec'
    },
    spend: {
      joveoToPubSpendDiscr: 'Joveo vs Pub Rec',
      pubToWebscrapedSpendDiscr: 'Pub Rec vs Webscrape',
      joveoToWebscrapedSpendDiscr: 'Joveo vs Webscrape',
      pubToJoveoSpendDiscr: 'Pub Rec vs Joveo',
      webscrapedToJoveoSpendDiscr: 'Webscrape vs Joveo',
      webscrapedToPubSpendDiscr: 'Webscrape vs Pub Rec'
    }
  };
  compareClicksKey = null;
  compareSpendKey = null;

  statusOptions = [
    { key: 'All Publishers', value: 'All' },
    { key: 'Web Scraped', value: 'WebScraped' }
  ];
  status = this.statusOptions[0];
  queryFilter: string;

  @ViewChild(DataTable)
  table: DataTable;

  constructor(public utilService: UtilService, public pubMonitorService: PubMonitorService) {}

  ngOnInit() {
    this.dateRange = {
      startDate: THIS_MONTH.range[0],
      endDate: THIS_MONTH.range[1]
    };

    this.pubMonitorService.setDate();

    this.getStats();
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

          if (this.routeData.data.entity === 'publishers') {
            obj['name'] =
              this.pubMonitorService.getPublisherNameDetails(obj['entity']) ||
              obj['entity'];
            const filterTemp = this.pubMonitorService.publisherDetails.filter(
              item => item.publisher === entity.pivots.pivot1
            )[0];
            if (filterTemp) {
              obj['dLogic'] = filterTemp['dLogicEnabled'];
              obj['webScrapEnabled'] = filterTemp['webScrapeEnabled'];
            }
          } else {
            obj['name'] = this.pubMonitorService.entityMap[obj['entity']] || obj['entity'];
          }

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

        if (this.pubMonitorService.statsView === 'all') {
          this.calculateDiscrepancies(tempData);
        }
        this.loading = false;
        this.allStatsData = tempData;
        this.statsData = tempData;

        if(this.queryFilter)
        {
          this.onFilter()
        }
        
      });
  };

  onFilter() {
    this.statsData = this.allStatsData.filter(rec => {
      if (this.status.value === 'All') {
        return rec.name.toLowerCase().includes(this.queryFilter.toLowerCase());
      } else {
        return (
          rec.webScrapEnabled &&
          rec.name.toLowerCase().includes(this.queryFilter.toLowerCase())
        );
      }
    });
  }

  onStatusChange(status) {
    this.queryFilter = null;
    this.status = status;
    if (this.status.value === 'All') {
      this.statsData = this.allStatsData;
    } else {
      this.statsData = this.allStatsData.filter(rec => {
        return rec.webScrapEnabled;
      });
    }
  }

  calculateDiscrepancies(tempData) {
    tempData.forEach(element => {
      // Clicks discrepancies
      element.joveoToPubClicksDiscr = this.getDiscrPerc(
        element.joveoStats.clicks,
        element.pubStats.clicks
      );
      element.pubToCMClicksDiscr = this.getDiscrPerc(
        element.pubStats.clicks,
        element.cmStats.clicks
      );
      element.joveoToCMClicksDiscr = this.getDiscrPerc(
        element.joveoStats.clicks,
        element.cmStats.clicks
      );

      element.pubToJoveoClicksDiscr = this.getDiscrPerc(
        element.pubStats.clicks,
        element.joveoStats.clicks
      );
      element.cmToJoveoClicksDiscr = this.getDiscrPerc(
        element.cmStats.clicks,
        element.joveoStats.clicks
      );
      element.cmToPubClicksDiscr = this.getDiscrPerc(
        element.cmStats.clicks,
        element.pubStats.clicks
      );

      // Spend discrepancies
      element.joveoToPubSpendDiscr = this.getDiscrPerc(
        element.joveoStats.spend,
        element.pubStats.spend
      );
      element.pubToWebscrapedSpendDiscr = this.getDiscrPerc(
        element.pubStats.spend,
        element.pubPortalStats.spend
      );
      element.joveoToWebscrapedSpendDiscr = this.getDiscrPerc(
        element.joveoStats.spend,
        element.pubPortalStats.spend
      );

      element.pubToJoveoSpendDiscr = this.getDiscrPerc(
        element.pubStats.spend,
        element.joveoStats.spend
      );
      element.webscrapedToJoveoSpendDiscr = this.getDiscrPerc(
        element.pubPortalStats.spend,
        element.joveoStats.spend
      );
      element.webscrapedToPubSpendDiscr = this.getDiscrPerc(
        element.pubPortalStats.spend,
        element.pubStats.spend
      );
    });
  }

  getDiscrPerc(val1, val2) {
    if (val1 === 0) {
      return '--';
    } else if (val2 === 0) {
      return 100;
    } else {
      return Math.round(((val1 - val2) / val1) * 100 * 100) / 100;
    }
  }

  onDateRangeChange(date) {
    this.pubMonitorService.dateRange = date.value;
    this.getStats();
  }

  onDateChange(dateRange) {
    this.pubMonitorService.setDate(dateRange);
    this.getStats();
  }

  statsViewChange(val) {
    this.pubMonitorService.statsView = val.value;
    this.getStats();
  }

  onTimezoneChange(timezoneId) {
    this.pubMonitorService.timezoneId = timezoneId;
    this.getStats();
  }

  onRowClick = function(row) {
    if (!this.disableClick) {
      this.rowClick.emit(row);
    }
  };

  onReload = function () {
    this.getStats();
  };

  showCompareEntities(metric, index) {
    this.compareMenu = this.compareMenus[metric][index];
  }

  onMenuSelection(metric1, metric2) {
    for (const key of Object.keys(this.fieldMapper)) {
      if (
        this.fieldMapper[key][0] === metric1 &&
        this.fieldMapper[key][1] === metric2
      ) {
        this.compareClicksKey = metric1.includes('Clicks')
          ? key
          : this.compareClicksKey;
        this.compareSpendKey = metric1.includes('Spend')
          ? key
          : this.compareSpendKey;
      }
    }
  }

  export() {
    this.table.exportCSV(',', 'report', false);
  }

  onCloseCompare(metric) {
    this.compareMenu = null;
    metric === 'clicks'
      ? (this.compareClicksKey = null)
      : (this.compareSpendKey = null);
  }

  bodyClassDecider(type, metric) {
    if (type === 'clicks') {
      return (
        this.compareClicksKey &&
        this.compareClicksKey.toLowerCase().includes(metric)
      );
    } else {
      return (
        this.compareSpendKey &&
        this.compareSpendKey.toLowerCase().includes(metric)
      );
    }
  }
}
