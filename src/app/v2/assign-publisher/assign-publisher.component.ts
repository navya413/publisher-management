import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-assign-publisher',
  templateUrl: './assign-publisher.component.html',
  styleUrls: ['./assign-publisher.component.scss']
})
export class AssignPublisherComponent implements OnInit {
  publishers = []
  searchText = ""
  
  constructor(private apiService  : ApiService,public dialogRef: MatDialogRef<AssignPublisherComponent>) { }

  ngOnInit() {
    this.getAllPublishers()
  }

  assignPublisher(){
    console.log("Publishers ::::>>>>>>",this.publishers)
  }
  getAllPublishers(){
    this.apiService.get("/papi/loki/agency/agencyId/joveo/publisher").subscribe(resp=>{
      this.publishers = resp.data
      this.publishers.forEach((publisher:any)=>{
        if (publisher.active){
          publisher.disabled = true
        }
      })
    })
  }

  close(){
    this.dialogRef.close()
  }
}
