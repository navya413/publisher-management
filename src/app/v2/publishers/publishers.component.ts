import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-publishers",
  templateUrl: "./publishers.component.html",
  styleUrls: ["./publishers.component.scss"]
})
export class PublishersComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  publishers = []
  selectedPublishers = []
  navLinks = [{ path: "../agencies", label: "All Agencies" }, { path: "../publishers", label: "All Publishers" }];
  filters :any = {
    query : "",
    status : ""
  }


  statusOptions = [{"name":"Active","value":"Active"}]
  ngOnInit() {
    this.getPublishers();
  }

  getPublishers() {
    this.apiService.get(environment.v2api + "/loki/admin/publisher",this.filters).subscribe(resp => {
      this.publishers = resp.data;
    });
  }
}
