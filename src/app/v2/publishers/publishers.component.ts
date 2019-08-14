import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { ViewContactsComponent } from "../view-contacts/view-contacts.component";

@Component({
  selector: "app-publishers",
  templateUrl: "./publishers.component.html",
  styleUrls: ["./publishers.component.scss"]
})
export class PublishersComponent implements OnInit {
  constructor(private apiService: ApiService,private router : Router,private dialog: MatDialog) {}

  loading :boolean = true;
  publishers = []
  totalResp:any = {}
  selectedPublishers = []
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

  onRowClick(event){
    console.log("Event :::",event)
    this.router.navigate(["v2","publisher",event.data.name,"agencies"])
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
}
