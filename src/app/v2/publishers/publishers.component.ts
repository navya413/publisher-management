import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { environment } from "../../../environments/environment";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material";
import { ViewContactsComponent } from "../view-contacts/view-contacts.component";
import { Item, PUB_EDIT_OPTIONS } from "../../model/entity";
import { PubManagementService } from "../../pub-management/services/pub-management.service";
import { PublisherSchemaDialog } from "../../pub-management/publisher-details/publisher-details.component";
import { NotificationsService } from "angular2-notifications";

@Component({
  selector: "app-publishers",
  templateUrl: "./publishers.component.html",
  styleUrls: ["./publishers.component.scss"]
})
export class PublishersComponent implements OnInit {
  selectedAgency = 'All Agencies';
  constructor(private apiService: ApiService,private router : Router,private dialog: MatDialog,
    private pubManagementService: PubManagementService,
    public route: ActivatedRoute,
    public notifService: NotificationsService 
  ) {}

  loading :boolean = true;
  publishers = []
  totalResp:any = {}
  selectedPublishers = []
  editOptions: Item[] = PUB_EDIT_OPTIONS;
  
  navLinks = [{ path: "../agencies", label: "All Agencies" }, { path: "../publishers", label: "All Publishers" }];
  filters :any = {
    query : "",
    status : "",
    page : 1,
    limit : 10
  }


  statusOptions = [{"name":"All","value":"All"},{ name: "Active", value: "active" },{"name":"Paused","value":"inactive"}]
  ngOnInit() {
    this.getPublishers();
  }

  onReload(){
    
  }

  onRowClick(row){
    console.log("Event :::",row)
    this.router.navigate(["v2","publisher",row.name,"agencies"])
  }

  getContactsCount(contacts:any,label:string){
    if (!contacts || contacts.length === 0){
      return "NA"
    }

    if (contacts.length === 1){
      return "1 "+label
    }

    if (contacts.length>1){
      return contacts.length + " "+label + "s"
    }

  }

  viewContactDetails(contacts:any){
    if(!contacts || contacts.length === 0){
      return;
    }

    let dialogRef = this.dialog.open(ViewContactsComponent, {
      panelClass: 'app-full-bleed-dialog',
      // height: '400px',
      //  minHeight : '400px',
       width: '500px',
       minWidth : '500',
       data : {
        emails : contacts
       }
    });

  }


  getPublishers() {
    this.loading = true;
    this.publishers = []
    this.totalResp = {data:[]};

    this.apiService.get(environment.v2api + "/loki/admin/publisher",this.filters).subscribe(resp => {
      this.publishers = resp.data;
      this.totalResp = resp;
      this.loading = false
    });
  }

  onPageChange(pageData) {
    this.filters.page = pageData.pageIndex + 1;
    this.filters.limit = pageData.pageSize;
    this.getPublishers();
  }

  openPublisherSchemaDialog() {
    this.pubManagementService.getPublisherV2('',this.selectedPublishers[0].id).subscribe(res => {
      const dialogRef = this.dialog.open(PublisherSchemaDialog, {
        width: '80vw',
        data: {
          publisher: res,
          selectedAgency: this.selectedAgency
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.success) {
          this.notifService.success('Success', 'Successfully updated');
        }
      });
    })
  }
  editPublisher(option) {
    if (option.value === "editPublisher") {
      const editData =  {
        publisher: this.selectedPublishers[0],
        selectedAgency: this.selectedAgency
      }
      this.pubManagementService.setPublisherData(editData);
      this.router.navigate(["v2","publisher",editData.publisher.id,"edit"])
    } else if (option.value === "feedMapping") {
      this.openPublisherSchemaDialog();
    }
  }
}
