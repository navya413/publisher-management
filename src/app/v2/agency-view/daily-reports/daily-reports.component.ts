import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment.staging';

@Component({
  selector: 'app-daily-reports',
  templateUrl: './daily-reports.component.html',
  styleUrls: ['./daily-reports.component.scss']
})
export class DailyReportsComponent implements OnInit {
  totalResp = {data:[],totalRecords:0}
  filters = {page:1,limit:10}
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DailyReportsComponent>,
  private apiService : ApiService) { }

  ngOnInit() {
    this.getDailyReports();
  }

  getDailyReports(){
    let url ="/api/loki/admin/publisher/dayStats?agencyId="+ this.data.agencyId +"&publisherId="+this.data.publisherId
    this.apiService.get(url).subscribe(resp=>{
      console.log("Resp :::::::",resp)
      this.totalResp = resp
    })
  }

  close(){
    this.dialogRef.close()
  }

  // TODO ::::
  export(){

  }

}
