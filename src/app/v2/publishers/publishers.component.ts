import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-publishers",
  templateUrl: "./publishers.component.html",
  styleUrls: ["./publishers.component.scss"]
})
export class PublishersComponent implements OnInit {
  constructor(private apiService: ApiService,private router : Router) {}

  loading :boolean = true;
  publishers = []
  selectedPublishers = []
  navLinks = [{ path: "../agencies", label: "All Agencies" }, { path: "../publishers", label: "All Publishers" }];
  filters :any = {
    query : "",
    status : ""
  }


  statusOptions = [{"name":"All","value":"All"},{"name":"Paused","value":"Paused"},{"name":"Disabled","value":"Disabled"}]
  ngOnInit() {
    this.getPublishers();
  }

  onRowClick(event){
    console.log("Event :::",event)
    this.router.navigate(["v2","publisher",event.data.name,"agencies"])
  }


  getPublishers() {
    this.apiService.get(environment.v2api + "/loki/admin/publisher",this.filters).subscribe(resp => {
      this.publishers = resp.data;
      this.loading = false
    });
  }
}
