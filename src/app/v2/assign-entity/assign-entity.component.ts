import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-assign-entity',
  templateUrl: './assign-entity.component.html',
  styleUrls: ['./assign-entity.component.scss']
})
export class AssignEntityComponent implements OnInit {
  publishers = []
  searchText = ""
  inputData :any
  title = ""
  btnLabel = ""
  
  constructor(private apiService  : ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssignEntityComponent>) { 
      this.inputData = data;
      this.getTitle();
    }



  ngOnInit() {
    this.getAllPublishers()
  }


  getTitle(){
    if (this.inputData.setupType === "publisher"){
       this.title = "Assign Joveo Publishers"
       this.btnLabel = "Assign Publisher"
       return
    }
    if (this.inputData.setupType === "agency"){
      this.title = "Assign Agency"
      this.btnLabel = "Assign Agency"
      return
    }
    this.title = ""
  }

  assignPublisher(){
    let entityIds = this.publishers.filter(it=>{
      return it.active
    }).map(filtered=>filtered.id)


    let data = {}
    data[this.inputData.entityAddKey] = entityIds

    this.apiService.post(this.entityCreateUrl(),data).subscribe((resp:any)=>{
      this.dialogRef.close(resp)
    })
  }

  getAllPublishers(){
    this.apiService.get(this.entityGetUrl()).subscribe(resp=>{
      this.publishers = resp.data
      this.publishers.forEach((publisher:any)=>{
        if (publisher.active){
          publisher.disabled = true
        }
      })
    })
  }


  entityGetUrl(){
    if (this.inputData.setupType === "publisher"){
      return "/api/loki/admin/agency/"+ this.inputData.entityId +"/joveo/publisher"
    }

    if (this.inputData.setupType === "agency"){
      return "/api/loki/admin/publisher/"+ this.inputData.entityId +"/joveo/agency"
    }
    return ""
  }

  entityCreateUrl(){
    if (this.inputData.setupType === "publisher"){
      return "/api/loki/admin/agency/"+ this.inputData.entityId +"/publisher/add"
    }

    if (this.inputData.setupType === "agency"){
      return "/api/loki/admin/publisher/"+this.inputData.entityId+"/agency/add"
    }
    return ""
  }


  close(){
    this.dialogRef.close()
  }
}
