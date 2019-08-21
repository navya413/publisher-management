import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbSegment } from '../../core/components/breadcrumb/breadcrumb.model';
import * as moment from 'moment';
import { TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, LAST_30_DAYS } from '../../date-range/presets.util';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  totalResp:any ={}
  agencyId;
  loading:boolean = true;
  breadcrumbSegments: BreadcrumbSegment[] = [];
  constructor(private activatedRoute : ActivatedRoute,private apiSerivce : ApiService,public utilService: UtilService) { }
  filters :any = {
    page : 1,
    limit : 10
  }

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

  ngOnInit() {
    this.dateRange = {
      startDate: THIS_MONTH.range[0],
      endDate: THIS_MONTH.range[1]
    };
    this.agencyId = this.activatedRoute.snapshot.params.agencyId;
    this.buildBreadcrumb()
    this.getStats()
  }

  onRowClick(event){

  }

  onFilter(event){
    
  }

  onReload(){

  }
  
  getStats(){
    this.loading = true;
    let url = "/gandalf/app/mojo/metrics/cm/by/clients"
    let params = {
      // "since":this.dateRange.startDate.format('YYYY-MM-DD'),
      "since" : "2019-03-01",
      "till":this.dateRange.endDate.format('YYYY-MM-DD'),
      page : this.filters.page,
      limit : this.filters.limit,
      agencyIds : this.agencyId
    }
    this.apiSerivce.get(url,params).subscribe(resp=>{
      console.log(">>>>RESP:::",resp)
      this.totalResp = resp
      this.loading = false
    })
  }

  buildBreadcrumb() {
    this.breadcrumbSegments = [{ label: "All Agencies", url: ["../../..", "agencies"] }, { label: "Agency : ", subTitle: this.agencyId }];
  }

}
