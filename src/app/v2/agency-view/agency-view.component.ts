import { Component, OnInit } from "@angular/core";
import { BreadcrumbSegment } from "../../core/components/breadcrumb/breadcrumb.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-agency-view",
  templateUrl: "./agency-view.component.html",
  styleUrls: ["./agency-view.component.scss"]
})
export class AgencyViewComponent implements OnInit {
  breadcrumbSegments: BreadcrumbSegment[];
  agencyId: string;
  filters: any = { query: "" };
  selectedPublishers = [];
  statusOptions = [{ name: "All", value: "All" }, { name: "Paused", value: "Paused" }, { name: "Disabled", value: "Disabled" }];
  modelsOptions = [
    { name: "Pay Per Click", value: "Pay Per Click" },
    { name: "Pay Per Apply", value: "Pay Per Apply" },
    { name: "Organic", value: "Organic" },
    { name: "Job Postings", value: "Job Postings" },
    { name: "Job Slots", value: "Job Slots" },
    { name: "Flat Pay Per Click", value: "Flat Pay Per Click" },
    { name: "Pay Per Posting", value: "Pay Per Posting" }
  ];
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.agencyId = this.activatedRoute.snapshot.params.agencyId;
    this.buildBreadcrumb();
  }

  buildBreadcrumb() {
    this.breadcrumbSegments = [{ label: "All Agencies", url: ["../../..", "agencies"] }, { label: "Agency : ", subTitle: this.agencyId }];
  }
}
