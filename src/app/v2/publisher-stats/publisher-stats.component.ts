import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../stats/services/stats.service';
import { TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, LAST_30_DAYS } from '../../date-range/presets.util';
import moment = require('moment');
import { VIEW_OPTIONS } from '../utils/util';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { V2Service } from '../v2.service';
import { BreadcrumbSegment } from '../../core/components/breadcrumb/breadcrumb.model';

@Component({
  selector: 'app-publisher-stats',
  templateUrl: './publisher-stats.component.html',
  styleUrls: ['./publisher-stats.component.scss']
})
export class PublisherStatsComponent implements OnInit {
  breadcrumbSegments: BreadcrumbSegment[] = [];
  loading :boolean = true;
  totalStatsResp :any = {}
  agencyId: string;
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

  selectedView:string = "Stats";
  viewOptions :string[]  = VIEW_OPTIONS

  compareOptions = {
    "joveo_clicks" : ['Pub Rec Clicks', 'CM Clicks'],
    "pubrec_clicks" : ['Joveo Clicks', 'CM Clicks'],
    "cm_clicks": ['Joveo Clicks', 'Pub Rec Clicks'],
    "ch_clicks" : [],
    "web_spend":[]
  }

  constructor(private apiSerivce : ApiService,private activatedRoute : ActivatedRoute,private v2Service : V2Service) { }

  ngOnInit() {
    this.agencyId = this.activatedRoute.snapshot.params.agencyId;
    this.dateRange = {
      startDate: THIS_MONTH.range[0],
      endDate: THIS_MONTH.range[1]
    };
    this.buildBreadcrumb()
    this.getStats()
  }

  buildBreadcrumb() {
    this.breadcrumbSegments = [{ label: "All Agencies", url: ["../../..", "agencies"] }, { label: "Agency : ", subTitle: this.agencyId }];
  }

  onDateRangeChange(date) {
  }


  bodyClassDecider(type, metric) {

  }

  onDateChange(dateRange) {
    console.log("Date range :::",dateRange)
    this.getStats();
  }

  getStats(){
    this.loading = true;
    let url = "api/loki/admin/agency/"+ this.agencyId +"/publisher/stats"
    let params = {
      // "since":this.dateRange.startDate.format('YYYY-MM-DD'),
      "since" : "2019/03/01",
      "till":this.dateRange.endDate.format('YYYY-MM-DD')
    }
    this.apiSerivce.get(url,params).subscribe(resp=>{
      console.log(">>>>RESP:::",resp)
      this.totalStatsResp = resp
      this.loading = false
    })
  }

}
