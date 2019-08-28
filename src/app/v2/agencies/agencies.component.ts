import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { MatDialog, MatSnackBar } from "@angular/material";
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
  editOptions = [{"name":"Edit","value":"Edit"}]
  selectedAgency;
  constructor(private snackbar : MatSnackBar,private apiService : ApiService,private router : Router,private dialog : MatDialog) {}


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
  handleMenuChange(option){
    if(option.value === "Edit"){
      this.openAgencyAddDialog("Edit")
    }
    console.log("Options >>>",option)
  }
  
  onRowClick(row){
    console.log("Event :::",event)
    this.router.navigate(["v2","agency",row.name,"publishers"])
  }

  onFilter(event){
    this.filters.query = event.filterQuery;
    this.getAgencies();
  }

  enrichEditData(event){
    if(event == "Edit"){
      return {
        entityType : "Update",
        title : "Edit Agency",
        selectedAgency : this.selectedAgency[0]
       }
    }

    return {
      entityType : "Add",
      title : "Add Agency"
     }
  }

  openAgencyAddDialog(event){
    let dialogRef = this.dialog.open(AddAgencyComponent, {
      panelClass: 'app-full-bleed-dialog',
       width: '500px',
       minWidth : '500',
       data : this.enrichEditData(event)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);

      if(result && result === "Created"){
        this.snackbar.open("Agency Added successfully","",{
          duration : 4 * 1000
        });
        this.getAgencies();
      }

      if(result && result === "Updated"){
        this.snackbar.open("Agency Updated successfully","",{
          duration : 4 * 1000
        });
        this.getAgencies();
      }
      
    });
  }
}
