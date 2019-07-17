import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-agencies",
  templateUrl: "./agencies.component.html",
  styleUrls: ["./agencies.component.scss"]
})
export class AgenciesComponent implements OnInit {
  navLinks = [{ path: "../agencies", label: "All Agencies" }, { path: "../publishers", label: "All Publishers" }];
  agencies  = []
  loading:boolean = true
  constructor(private apiService : ApiService) {}

  ngOnInit() {
    this.getAgencies()
  }

  getAgencies(){
    this.apiService.get(environment.v2api + "/loki/admin/agency",{query:"A"}).subscribe(resp=>{
      console.log("RESP ::::",resp)
      this.loading = false
      this.agencies = resp.data
    })
  }
}
