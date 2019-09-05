import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-daily-reports',
  templateUrl: './daily-reports.component.html',
  styleUrls: ['./daily-reports.component.scss']
})
export class DailyReportsComponent implements OnInit {
  totalResp = {data:[],totalRecords:0,success:true}
  filters = {page:1,limit:10}
  loading : boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DailyReportsComponent>,
  private utilService : UtilService,
  private apiService : ApiService) { }

  ngOnInit() {
    this.getDailyReports();
  }

  getDailyReports(){
    this.loading = true;
    let url ="/api/loki/admin/publisher/dayStats?agencyId="+ this.data.agencyId +"&publisherId="+this.data.publisherId
    this.apiService.get(url).subscribe(resp=>{
      this.loading = false;
      console.log("Resp :::::::",resp)
      this.totalResp = resp;
    })
  }

  close(){
    this.dialogRef.close()
  }

  getHeaders(){
    return [ 
       {
         name : "Date",
         field : "date"
       },{
         name : "Joveo Clicks",
         field : "clicks"
       },
       {
         name : "Total Clicks",
         field : "allClicks"
       },
       {
         name : "Joveo Applies",
         field : "applies"
       },
       {
         name : "Total Applies",
         field : "allApplies"
       },
       {
         name : "Joveo CTA",
         field : "cta"
       },
       {
         name : "Total CTA",
         field : "allCta"
       },
       {
         name : "Spend",
         field : "spent"
       },
       {
         name : "CPC",
         field : "cpc"
       },
       {
         name : "CPA",
         field : "cpa"
       },
       {
         name : "CPH",
         field : "cph"
       },{
         name:"Joveo ATH(%)",
         field : "ath"
       },{
        name:"Total ATH(%)",
        field : "allAth"
      }
     ]
   }

  export(){
    this.utilService.downloadCSVGeneric(this.getHeaders(),this.totalResp.data,"daily_reports")
  }

}
