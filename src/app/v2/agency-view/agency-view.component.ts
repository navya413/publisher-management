import { Component, OnInit } from "@angular/core";
import { BreadcrumbSegment } from "../../core/components/breadcrumb/breadcrumb.model";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../services/api.service";
import { AssignPublisherComponent } from "../assign-publisher/assign-publisher.component";
import { MatDialog } from "@angular/material";

@Component({
  selector: "app-agency-view",
  templateUrl: "./agency-view.component.html",
  styleUrls: ["./agency-view.component.scss"]
})
export class AgencyViewComponent implements OnInit {
  breadcrumbSegments: BreadcrumbSegment[] = [];
  agencyId: string;
  filters: any = { query: "",status:"All" };
  selectedPublishers = [];
  publishers = []
  statusOptions = [{ name: "All", value: "All" }, { name: "Paused", value: "I" }, { name: "Disabled", value: "A" }];
  setupView:boolean = true

  modelsOptions = [
    { name: "Pay Per Click", value: "Pay Per Click" },
    { name: "Pay Per Apply", value: "Pay Per Apply" },
    { name: "Organic", value: "Organic" },
    { name: "Job Postings", value: "Job Postings" },
    { name: "Job Slots", value: "Job Slots" },
    { name: "Flat Pay Per Click", value: "Flat Pay Per Click" },
    { name: "Pay Per Posting", value: "Pay Per Posting" }
  ];
  constructor(private activatedRoute: ActivatedRoute,private apiService : ApiService,private dialog: MatDialog) {}

  ngOnInit() {
    this.agencyId = this.activatedRoute.snapshot.params.agencyId;
    this.buildBreadcrumb();
    this.getAllPublishers();
  }

  getAllPublishers(){
    this.apiService.get("/api/loki/admin/agency/"+ this.agencyId +"/publisher/setup",this.filters).subscribe(resp=>{
      this.publishers = resp.data
    })
  }

  buildBreadcrumb() {
    this.breadcrumbSegments = [{ label: "All Agencies", url: ["../../..", "agencies"] }, { label: "Agency : ", subTitle: this.agencyId }];
  }

  openAssignPublisherModal(){
    let dialogRef = this.dialog.open(AssignPublisherComponent, {
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
      this.getAllPublishers();
    });
  }
}
