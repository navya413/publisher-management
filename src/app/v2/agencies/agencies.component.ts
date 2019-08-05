import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-agencies",
  templateUrl: "./agencies.component.html",
  styleUrls: ["./agencies.component.scss"]
})
export class AgenciesComponent implements OnInit {
  navLinks = [{ path: "../agencies", label: "All Agencies" }, { path: "../publishers", label: "All Publishers" }];
  agencies  = []
  loading:boolean = true
  constructor(private apiService : ApiService,private router : Router) {}


  filters :any = {query:""}

  ngOnInit() {
    this.getAgencies()
  }

  getAgencies(){
    this.apiService.get(environment.v2api + "/loki/admin/agency",this.filters).subscribe(resp=>{
      console.log("RESP ::::",resp)
      this.loading = false
      this.agencies = resp.data
    })
  }
  
  onRowClick(event){
    console.log("Event :::",event)
    this.router.navigate(["v2","agency",event.data.name,"publishers"])
  }

  onFilter(event){
    this.filters.query = event.filterQuery;
    this.getAgencies();
  }
}
