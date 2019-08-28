import { Component, OnInit } from "@angular/core";
import { BreadcrumbSegment } from "../../core/components/breadcrumb/breadcrumb.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api.service";
import { AssignEntityComponent } from "../assign-entity/assign-entity.component";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ViewContactsComponent } from "../view-contacts/view-contacts.component";
import { PubManagementService } from "../../pub-management/services/pub-management.service";
import { AGENCY_ENABLE_EDIT_OPTIONS, AGENCY_PAUSE_EDIT_OPTIONS } from "../../model/entity"

@Component({
  selector: "app-agency-view",
  templateUrl: "./agency-view.component.html",
  styleUrls: ["./agency-view.component.scss"]
})
export class AgencyViewComponent implements OnInit {
  breadcrumbSegments: BreadcrumbSegment[] = [];
  agencyId: string;
  filters: any = { query: "",status:"All" ,page: 1 ,limit:10};
  selectedPublishers = [];
  publishers = []
  totalResp : any = {}
  editOptions = []
  statusOptions = [{ name: "All", value: "All" }, { name: "Active", value: "active" }, { name: "Paused", value: "inactive" }];
  setupView:boolean = true;
  loading : boolean = true;
  selectedView:string = "Settings";
  viewOptions :string[]  = ["Settings","Stats","Billing","Clicks"]

  modelsOptions = [
    { name: "Select Model", value: "" },
    { name: "Pay Per Click", value: "cpc" },
    { name: "Pay Per Apply", value: "cpa" },
    { name: "Organic", value: "organic" },
    { name: "Job Postings", value: "cpj" },
    { name: "Job Slots", value: "cps" },
    { name: "Flat Pay Per Click", value: "flat cpc" },
    { name: "Pay Per Posting", value: "ppp" }
  ];
  constructor(private activatedRoute: ActivatedRoute,
    private snackbar : MatSnackBar,
    private router : Router,
    private apiService : ApiService,
    private dialog: MatDialog,
    private pubManagementService: PubManagementService) {}

  ngOnInit() {
    this.agencyId = this.activatedRoute.snapshot.params.agencyId;
    this.buildBreadcrumb();
    this.getAllPublishers();
  }

  getAllPublishers(){
    this.loading = true;
    this.apiService.get("/api/loki/admin/agency/"+ this.agencyId +"/publisher/setup",this.filters).subscribe(resp=>{
      this.publishers = resp.data;
      this.totalResp = resp;
      console.log(":::::",this.totalResp.totalRecords)
      this.loading = false;
    })
  }

  changeView(){
    console.log(":::::",this.selectedView)
    this.router.navigate(["v2","agency",this.agencyId,this.selectedView.toLowerCase()])
  }

  onPageChange(pageData) {
    this.filters.page = pageData.pageIndex + 1;
    this.filters.limit = pageData.pageSize;
    this.getAllPublishers();
  }

  buildBreadcrumb() {
    this.breadcrumbSegments = [{ label: "All Agencies", url: ["../../..", "agencies"] }, { label: "Agency : ", subTitle: this.agencyId }];
  }

  viewContactDetails(contacts:any){
    console.log(">>>",contacts)
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

  onRowSelectionChange(event){
    this.selectedPublishers= event
    this.editOptions =[]
    if(this.selectedPublishers.length>0 && event[0].status === 'A'){
      this.editOptions = AGENCY_ENABLE_EDIT_OPTIONS;
    } else {
      this.editOptions = AGENCY_PAUSE_EDIT_OPTIONS;
    }
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

  editPublisher(option){
    if(option.value === "Pause"){
      this.pausePublisher();
    } else if (option.value === "editPublisher") {
      const editData =  {
        publisher: this.selectedPublishers[0],
        selectedAgency: this.activatedRoute.snapshot.params.agencyId
      }
      this.pubManagementService.setPublisherData(editData);
      this.router.navigate(["v2","agency",editData.selectedAgency,"publisher",editData.publisher.id,"edit"])
    }
  }

  pausePublisher(){
    let url = "/api/loki/admin/agency/"+ this.agencyId +"/pause"
    this.apiService.post(url,{"publisherid":this.selectedPublishers[0].id}).subscribe((resp:any)=>{
      this.snackbar.open("Publisher Paused","",{duration: 1 * 1000});
      this.selectedPublishers[0].status = "I";
      this.selectedPublishers[0].checked = false;
      this.selectedPublishers = []
    })
  }

  openAssignPublisherModal(){
    let dialogRef = this.dialog.open(AssignEntityComponent, {
      panelClass: 'app-full-bleed-dialog',
      // height: '400px',
      //  minHeight : '400px',
       width: '500px',
       minWidth : '500',
       data : {
        entityId : this.agencyId,
        entityAddKey : "publisherIds",
        setupType : "publisher"
       }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);

      if (result){
        this.snackbar.open("Publishers assigned successfully","",{
          duration : 1 * 1000
        });
      }
      this.selectedPublishers=[]
      this.getAllPublishers();
    });
  }
}
