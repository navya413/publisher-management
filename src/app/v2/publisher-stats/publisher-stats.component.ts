import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../stats/services/stats.service';
import { TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, LAST_30_DAYS } from '../../date-range/presets.util';
import * as moment from 'moment'
import { VIEW_OPTIONS } from '../utils/util';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { V2Service } from '../v2.service';
import { BreadcrumbSegment } from '../../core/components/breadcrumb/breadcrumb.model';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

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


  clicks_compare_config = [
    {
      "label" : "Joveo Clicks",
      "dataKey" : "joveo",
      "toolTip" : "",
      "entities" : []
    },
    {
      "label" : "Pub Rec Clicks",
      "dataKey" : "pub",
      "toolTip" : "",
      "entities" : []
    },{
      "label" : "CM Clicks",
      "dataKey" : "cm",
      "toolTip" : "",
      "entities" : []
    },{
      "label" : "CH Clicks",
      "dataKey" : "ch",
      "toolTip" : "",
      "entities" : []
    }
  ]


  spend_compare_config = [
    {
      "label" : "Joveo Spend",
      "dataKey" : "joveo",
      "toolTip" : "",
      "entities" : []
    },
    {
      "label" : "Pub Rec Spend",
      "dataKey" : "pub",
      "toolTip" : "",
      "entities" : []
    },{
      "label" : "Webscrape Spend",
      "dataKey" : "pubPortal",
      "toolTip" : "",
      "entities" : []
    },{
      "label" : "CH Spend",
      "dataKey" : "ch",
      "toolTip" : "",
      "entities" : []
    }
  ]

  constructor(private apiSerivce : ApiService,private activatedRoute : ActivatedRoute,private v2Service : V2Service,
    private domSanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry) { 

      iconRegistry.addSvgIcon(
        "multi-drop",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/images/svg-icons/multi-drop.svg")
      );
    }

  ngOnInit() {
    this.agencyId = this.activatedRoute.snapshot.params.agencyId;
    this.dateRange = {
      startDate: THIS_MONTH.range[0],
      endDate: THIS_MONTH.range[1]
    };
    this.buildBreadcrumb()
    this.getStats()
  }

  onReload(){

  }

  onRowClick(event){

  }

  onFilter(event){
    
  }

  comparemenu;
  showClicksCompareEntities(entity:any){
    this.comparemenu = this.clicks_compare_config.filter(it=>{
      return it.label != entity
    })
    this.comparemenu.forEach(item=>{
      item.entities = [entity,item.label]
      item.toolTip = entity + " vs " + item.label
    })
  }

  showSpendCompareEntities(entity:any){
    this.comparemenu = this.spend_compare_config.filter(it=>{
      return it.label != entity
    })
    this.comparemenu.forEach(item=>{
      item.entities = [entity,item.label]
      item.toolTip = entity + " vs " + item.label
    })
  }

  buildBreadcrumb() {
    this.breadcrumbSegments = [{ label: "All Agencies", url: ["../../..", "agencies"] }, { label: "Agency : ", subTitle: this.agencyId }];
  }

  onDateRangeChange(date) {
  }


  bodyClassDecider(metric) {
    if(metric.indexOf("Spend") != -1){
      if (this.selectedSpendComparemenu && this.selectedSpendComparemenu.entities.indexOf(metric) != -1){
        return true
      }
      return false  
    }
    if (this.selectedComparemenu && this.selectedComparemenu.entities.indexOf(metric) != -1){
      return true
    }
    return false
  }

  compareClicksKey = ""
  compareSpendKey = ""
  compareTooltip = ""
  spendcompareTooltip = ""
  selectedComparemenu :any;
  selectedSpendComparemenu :any;

  onCloseCompare(compareType){
    if(compareType === "clicks"){
      this.compareClicksKey = ""
      this.selectedComparemenu = null
    }
    if(compareType === "spend"){
      this.compareSpendKey = ""
      this.selectedSpendComparemenu = null
    }
    this.compareTooltip = ""
  }


  onMenuSelection(parentKey,metric1, menu) {
    this.selectedComparemenu = menu
    this.compareClicksKey = "compare_clicks"
    this.compareTooltip = menu.toolTip;
    this.totalStatsResp.data.forEach(item => {
        item["compare_clicks"] = this.getDiscrPerc(item[parentKey][metric1],item[parentKey][menu.dataKey])
    });
  }

  onSpendMenuSelection(parentKey,metric1, menu){
    this.selectedSpendComparemenu = menu
    this.compareSpendKey = "compare_spend"
    this.spendcompareTooltip = menu.toolTip;
    this.totalStatsResp.data.forEach(item => {
        item["compare_spend"] = this.getDiscrPerc(item[parentKey][metric1],item[parentKey][menu.dataKey])
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
