import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { AddAgencyComponent } from "../add-agency/add-agency.component";

@Component({
  selector: "app-agencies",
  templateUrl: "./agencies.component.html",
  styleUrls: ["./agencies.component.scss"]
})
export class AgenciesComponent implements OnInit {
  navLinks = [{ path: "../agencies", label: "All Agencies" }, { path: "../publishers", label: "All Publishers" }];
  agencies  = []
  totalResp : any = {};
  loading:boolean = true
  constructor(private apiService : ApiService,private router : Router,private dialog : MatDialog) {}


  filters :any = {query:"",page:1,limit:10}

  ngOnInit() {
    this.getAgencies()
  }

  getAgencies(){
    this.apiService.get(environment.v2api + "/loki/admin/agency",this.filters).subscribe(resp=>{
      console.log("RESP ::::",resp)
      this.loading = false
      this.agencies = resp.data
      this.totalResp = resp
    })
  }

  onPageChange(pageData) {
    this.filters.page = pageData.pageIndex + 1;
    this.filters.limit = pageData.pageSize;
    this.getAgencies();
  }
  
  onReload(){

  }
  
  onRowClick(event){
    console.log("Event :::",event)
    this.router.navigate(["v2","agency",event.data.name,"publishers"])
  }

  onFilter(event){
    this.filters.query = event.filterQuery;
    this.getAgencies();
  }

  openAgencyAddDialog(event){
    console.log("In add agency .....")
    let dialogRef = this.dialog.open(AddAgencyComponent, {
      panelClass: 'app-full-bleed-dialog',
      // height: '400px',
      //  minHeight : '400px',
       width: '500px',
       minWidth : '500',
       data : {
        entityType : "Add",
        title : "Add Agency"
       }
    });
  }
}
