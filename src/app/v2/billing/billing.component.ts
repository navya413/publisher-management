import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbSegment } from '../../core/components/breadcrumb/breadcrumb.model';
import * as moment from 'moment';
import { TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, LAST_30_DAYS } from '../../date-range/presets.util';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import { VIEW_OPTIONS } from '../utils/util';
import { V2Service } from '../v2.service';
import { DataTable } from 'momentum-table';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  totalResp:any ={}
  agencyId;
  loading:boolean = true;
  timezoneId;
  selectedView;
  breadcrumbSegments: BreadcrumbSegment[] = [];
  constructor(private activatedRoute : ActivatedRoute,
    public v2Service : V2Service,
    private apiSerivce : ApiService,public utilService: UtilService) { }
  filters :any = {
    page : 1,
    limit : 10,
    query : ""
  }
  routeType:string
  screen : string;

  viewOptions :string[]  = VIEW_OPTIONS
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

  @ViewChild(DataTable)
  table: DataTable;


  ngOnInit() {
    this.routeType = this.activatedRoute.snapshot.data.routeType;
    this.screen = this.activatedRoute.snapshot.data.screen;

    this.selectedView = this.activatedRoute.snapshot.data.selectedView;

    this.dateRange = {
      startDate: THIS_MONTH.range[0],
      endDate: THIS_MONTH.range[1]
    };
    this.agencyId = this.activatedRoute.snapshot.params.entityId;
    console.log("this.agencyId .....",this.agencyId)

    this.buildBreadcrumb()
    this.getStats()
  }

  onRowClick(event){

  }

  onFilter(event){
      this.getStats();
  }

  onReload(){

  }
  
  changeView(entityId, option){
    this.v2Service.changeView(entityId,this.routeType,option)
  }

  onDateChange(){
    this.totalResp.data = [];
    this.getStats()
  } 

  getStats(){
    this.loading = true;
    this.totalResp.data = [];
    let url = this.getUrl()
    let params = {
      // "since":this.dateRange.startDate.format('YYYY-MM-DD'),
      "since" : "2019-03-01",
      "till":this.dateRange.endDate.format('YYYY-MM-DD'),
      page : this.filters.page,
      limit : this.filters.limit,
      agencyIds : this.agencyId
    }

    if (this.filters.query){
      params["query"] = this.filters.query
    }

    if(this.timezoneId){
      params["tz"] = this.timezoneId
    }

    this.apiSerivce.get(url,params).subscribe(resp=>{
      this.totalResp = resp
      this.loading = false
    })
  }

  onTimezoneChange(timezoneId){
    console.log("Time Zone ::",timezoneId)
    this.getStats();
  }

  onPageChange(pageData) {
    this.filters.page = pageData.pageIndex + 1;
    this.filters.limit = pageData.pageSize;
    this.getStats();
  }

  export() {
    this.table.exportCSV(',', 'report', false);
  }

  getUrl(){
    if(this.activatedRoute.snapshot.data.routeType === "agency"){
      return "api/loki/admin/agency/"+ this.agencyId +"/publisher/stats"
    }
    return "api/loki/admin/publisher/"+ this.agencyId +"/agency/stats"
  }

  buildBreadcrumb() {
    if(this.activatedRoute.snapshot.data.routeType === "agency"){
      this.breadcrumbSegments = [{ label: "All Agencies", url: ["../../..", "agencies"] }, { label: "Agency : ", subTitle: this.agencyId }];
      return
    }
    this.breadcrumbSegments = [{ label: "All Publishers", url: ["../../..", "publishers"] }, { label: "Publisher : ", subTitle: this.agencyId }];
  }


  // buildBreadcrumb() {
  //   this.breadcrumbSegments = [{ label: "All Agencies", url: ["../../..", "agencies"] }, { label: "Agency : ", subTitle: this.agencyId }];
  // }

}
