import { Component, OnInit } from '@angular/core';
import { BreadcrumbSegment } from '../../core/components/breadcrumb/breadcrumb.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AssignEntityComponent } from '../assign-entity/assign-entity.component';
import { VIEW_OPTIONS } from '../utils/util';
import { V2Service } from '../v2.service';

@Component({
  selector: 'app-agency-setup',
  templateUrl: './agency-setup.component.html',
  styleUrls: ['./agency-setup.component.scss']
})
export class AgencySetupComponent implements OnInit {
  breadcrumbSegments: BreadcrumbSegment[] = [];
  publisherId: string;
  setupView : boolean = true;
  loading : boolean = true;
  agencies = []
  totalResp :any = {}
  selectedAgencies = [];
  filters = {page:1,limit:10,query:"",status:"All"}
  viewOptions :string[]  = VIEW_OPTIONS
  selectedView:string = "Settings";
  statusOptions = [{ name: "All", value: "All" }, { name: "Active", value: "active" }, { name: "Paused", value: "inactive" }];


  constructor(private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private v2Service : V2Service,
    private snackbar : MatSnackBar,
    private apiService : ApiService) { }

  ngOnInit() {
    this.publisherId = this.activatedRoute.snapshot.params.publisherId;
    this.buildBreadcrumb()
    this.getAgenciesSetup()
  }


  getAgenciesSetup(){
    this.loading = true;
    this.totalResp = {};
    this.agencies = [];
    let url = "/api/loki/admin/publisher/"+ this.publisherId +"/agency/setup"

    let params = {}
    if(this.filters.query){
      params["query"] = this.filters.query
    }
    params["status"] = this.filters.status

    this.apiService.get(url,params).subscribe((resp:any)=>{
      this.agencies = resp.data;
      this.totalResp = resp;
      this.loading = false;
    })
  }

  onPageChange(pageData) {
    this.filters.page = pageData.pageIndex + 1;
    this.filters.limit = pageData.pageSize;
    this.getAgenciesSetup();
  }

  viewContactDetails(row:any){
    console.log(row)
  }

  buildBreadcrumb() {
    this.breadcrumbSegments = [{ label: "All Publishers", url: ["../../..", "publishers"] }, { label: "Publisher : ", subTitle: this.publisherId }];
  }

  openAssignAgencyModal(){
    let dialogRef = this.dialog.open(AssignEntityComponent, {
      panelClass: 'app-full-bleed-dialog',
       width: '500px',
       minWidth : '500',
       data : {
        entityId : this.publisherId,
        entityAddKey : "agencyIds",
        setupType : "agency"
       }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);

      if (result){
        this.snackbar.open("Agencies assigned successfully","",{
          duration : 1 * 1000
        });
      }
      this.getAgenciesSetup();
    });
  }
}
