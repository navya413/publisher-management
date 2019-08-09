import { Component, OnInit } from '@angular/core';
import { BreadcrumbSegment } from '../../core/components/breadcrumb/breadcrumb.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material';
import { AssignPublisherComponent } from '../assign-publisher/assign-publisher.component';

@Component({
  selector: 'app-agency-setup',
  templateUrl: './agency-setup.component.html',
  styleUrls: ['./agency-setup.component.scss']
})
export class AgencySetupComponent implements OnInit {
  breadcrumbSegments: BreadcrumbSegment[] = [];
  publisherId: string;
  setupView : boolean = true;
  agencies = []
  selectedAgencies = [];
  filters = {}


  constructor(private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private apiService : ApiService) { }

  ngOnInit() {
    this.publisherId = this.activatedRoute.snapshot.params.publisherId;
    this.buildBreadcrumb()
    this.getAgenciesSetup()
  }


  getAgenciesSetup(){
    let url = "/api/loki/admin/publisher/"+ this.publisherId +"/agency/setup"
    this.apiService.get(url).subscribe((resp:any)=>{
      this.agencies = resp.data;
    })
  }


  buildBreadcrumb() {
    this.breadcrumbSegments = [{ label: "All Publishers", url: ["../../..", "publishers"] }, { label: "Agency : ", subTitle: this.publisherId }];
  }

  openAssignAgencyModal(){
    let dialogRef = this.dialog.open(AssignPublisherComponent, {
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
      this.getAgenciesSetup();
    });
  }
}
