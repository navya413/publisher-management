import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {
  BID_TYPES
} from '../../model/entity';
import { UtilService } from '../../services/util.service';
import { BreadcrumbSegment } from '../../core/components/breadcrumb/breadcrumb.model';
import { PubManagementService } from '../../pub-management/services/pub-management.service';

@Component({
  selector: 'app-publisher-create',
  templateUrl: './publisher-create.component.html',
  styleUrls: ['./publisher-create.component.scss']
})
export class PublisherCreateComponent implements OnInit, OnDestroy {
  loading: boolean;

  creationForm;
  ftpConfigSubscription$;
  publisherDetailsSub$

  flatBidPublisher = false;
  isModeEdit = false;
  editPublisher;
  error: string;
  bidTypes = BID_TYPES;
  feedTypes = [
    {name: 'Comprehensive', value: false},
    {name: 'Client', value: true}
  ]
  breadcrumbSegments: BreadcrumbSegment[] = [];  

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public utilService: UtilService,
    public pubManagementService: PubManagementService,
  ) { }

  ngOnInit() {
    if ( this.route.snapshot.data.data) {
      this.isModeEdit = true;
      this.editPublisher = this.route.snapshot.data.data;
     
    }
    this.buildBreadcrumb();  
    this.initForm();
    this.ftpConfigSubscription$ = this.creationForm
      .get('placement')
      .get('ftpConfig')
      .get('credentials')
      .valueChanges.subscribe(res => {
        this.utilService.objectCleaner(res);
        const controls = this.creationForm
          .get('placement')
          .get('ftpConfig')
          .get('credentials')['controls'];
        if (!this.utilService.isEmpty(res)) {
          Object.keys(controls).forEach(key => {
            controls[key].setValidators([Validators.required]);
            controls[key].updateValueAndValidity({ emitEvent: false });
          });
        } else {
          Object.keys(controls).forEach(key => {
            controls[key].setValidators([Validators.nullValidator]);
            controls[key].updateValueAndValidity({ emitEvent: false });
          });
        }
      });
  }

  initForm() {
    this.creationForm = this.fb.group({
      placement: this.fb.group({
        name: ['', Validators.required],
        bidType: ['', Validators.required],
        currency: ['', Validators.required],
        minBid: [],
        url: ['', Validators.required],
        country: [],
        industry: [],
        deliverFeedByFTP: [],
        perClientPlacements: [],
        isCompressedFeed: [],
        ftpConfig: this.fb.group({
          credentials: this.fb.group({
            host: [],
            username: [],
            password: [],
            pathTemplate: []
          })
        }),
        vendorPortalDetails: this.fb.array([
          this.fb.group({
            url: [],
            username: [],
            password: []
          })
        ]),
        publisherContactDetailsRevamp: this.fb.array([
          this.fb.group({
            email: [],
            vpAccessEnabled: [false],
            notificationEnabled: [false],
            notificationAlertThreshold: []
          }) 
        ]),
        publisherReconciliationDetails: this.fb.group({
          mode: [],
          startDate: [],
          frequency: [],
          timezone: []
        })
      })
    });

    if (this.isModeEdit) {
      const placementFields = this.editPublisher.placement || this.editPublisher;
      Object.keys(placementFields).forEach(item => {
        if (
          [
            'name',
            'currency',
            'minBid',
            'url',
            'country',
            'deliverFeedByFTP',
            'perClientPlacements',
            'isCompressedFeed'
          ].includes(item)
        ) {
          this.creationForm.controls.placement.controls[item].patchValue(
            placementFields[item]
          );
        } else if (item === 'bidType') {
          this.creationForm.controls.placement.controls[item].patchValue(
            placementFields[item].name
          );
        } else if (item === 'vendorPortalDetails') {
          const portalDetails = this.creationForm.controls.placement['controls'].vendorPortalDetails as FormArray;
          portalDetails.removeAt(0);
          placementFields[item].forEach(details => {
            portalDetails.push(this.fb.group({
              url: [details.url],
              username: [details.username],
              password: [details.password]
            }));
          });
        } else if (item === 'publisherContactDetailsRevamp') {
          const contactDetails = this.creationForm.controls.placement['controls'].publisherContactDetailsRevamp as FormArray;
          contactDetails.removeAt(0);
          placementFields[item].forEach(details => {
            contactDetails.push(this.fb.group({
              email: [details.email],
              vpAccessEnabled: [details.vpAccessEnabled],
              notificationEnabled: [details.notificationEnabled],
              notificationAlertThreshold: [details.notificationAlertThreshold]
            }));
          });

        } else if (item === 'publisherReconciliationDetails') {
          this.creationForm.controls.placement.controls[
            item
          ].controls.mode.patchValue(placementFields[item].mode);
          this.creationForm.controls.placement.controls[
            item
          ].controls.startDate.patchValue(
            moment(placementFields[item].startDate).toDate()
          );
          this.creationForm.controls.placement.controls[
            item
          ].controls.frequency.patchValue(placementFields[item].frequency);
          this.creationForm.controls.placement.controls[
            item
          ].controls.timezone.patchValue(placementFields[item].timezone);
        } else if (item === 'ftpConfig') {
          this.creationForm.controls.placement.controls[
            item
          ].controls.credentials.controls.host.patchValue(
            placementFields[item].credentials.host
          );
          this.creationForm.controls.placement.controls[
            item
          ].controls.credentials.controls.username.patchValue(
            placementFields[item].credentials.username
          );
          this.creationForm.controls.placement.controls[
            item
          ].controls.credentials.controls.password.patchValue(
            placementFields[item].credentials.password
          );
          this.creationForm.controls.placement.controls[
            item
          ].controls.credentials.controls.pathTemplate.patchValue(
            placementFields[item].pathTemplate
          );
        }
      });
    }
  }
  buildBreadcrumb() {
    this.breadcrumbSegments = [{ label: "All Publishers", url: [this.isModeEdit ?  "../../..": "../../", "publishers"] }];
    let subSegment;
    if (this.isModeEdit) {
      subSegment = {
        label: "Edd Publisher : ",
        subTitle: this.editPublisher.placement.name
      }
    } else {
      subSegment = {
        label: "Add Publisher"
      }
    }
    this.breadcrumbSegments.push(subSegment)
    
  }
  addPubContact() {
    const control = this.creationForm.controls['placement'].controls['publisherContactDetailsRevamp'];
    control.push(this.fb.group({
      email: [],
      vpAccessEnabled: [false],
      notificationEnabled: [false],
      notificationAlertThreshold: []
    }))
  }
  trackByItems(index:string, item:any) {
    console.log('inside track by', index, item);
    return item.id;
  }
  removePubContact(index) {
    const control = this.creationForm.controls['placement'].controls['publisherContactDetailsRevamp'];
    control.removeAt(index);    
  }
  addVendorDetails() {
    const control = this.creationForm.controls['placement'].controls['vendorPortalDetails'];
    control.push(this.fb.group({
      url: [],
      username: [],
      password: []
    }))
  }
  removeVendorDetails(index) {
    const control = this.creationForm.controls['placement'].controls['vendorPortalDetails'];
    control.removeAt(index);    
  }
  getFieldErrorMessage(error) {
    const first = Object.keys(error)[0];
    return first === 'pattern'
      ? 'Only following special characters allowed . - _ ()'
      : 'Name is required';
  }

  onSubmit() {
    if (!this.creationForm.valid) {
      return;
    }
    if (
      this.creationForm.value.placement.publisherReconciliationDetails &&
      this.creationForm.value.placement.publisherReconciliationDetails.startDate
    ) {
      this.creationForm.value.placement.publisherReconciliationDetails.startDate +=
        '';
    }
    this.utilService.objectCleaner(this.creationForm.value);
    this.createPublisher();
  }

  createPublisher() {
    if (!this.isModeEdit) {
      this.creationForm.value.placement[
        'value'
      ] = this.creationForm.value.placement['name']
        .replace(/\s/g, '_')
        .replace(/\./g, '_');
    } else {
      this.creationForm.value.placement[
        'value'
      ] = this.editPublisher.placement.value;
      this.creationForm.value.placement['id'] = this.editPublisher.placement.id;
    }

    if (this.flatBidPublisher) {
      delete this.creationForm.value.placement['minBid'];
    } else {
      delete this.creationForm.value.placement['flatBidValue'];
    }

    const dataObj = this.creationForm.value;
    this.loading = true;
    this.error = null;
    
    if (!this.isModeEdit) {
      this.addPublisher(dataObj);
    } else {
      const updatedData = {
        id: dataObj.placement.id,
        update: {}
      };
      updatedData['update']= dataObj.placement;
      this.updatePublisher(updatedData);
    }

  }

  addPublisher(dataObj) {
    this.pubManagementService.addPublisher(dataObj).subscribe(
      res => {
        this.loading = false;
        this.navigateBack();
      },
      err => {
        this.error = 'something went wrong, please try again';
        this.loading = false;
      }
    );
  }

  updatePublisher(dataObj) {
    this.pubManagementService.updatePublisher('All Agencies',dataObj).subscribe(
      res => {
        this.loading = false;
        this.navigateBack();
      },
      err => {
        this.error = 'something went wrong, please try again';
        this.loading = false;
      }
    );
  }


  navigateBack() {
    this.pubManagementService.setPublisherData(null);
    this.router.navigate([this.isModeEdit ? '../../../publishers' :'../../publishers'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    if (this.ftpConfigSubscription$) {
      this.ftpConfigSubscription$.unsubscribe();
    }

    if (this.publisherDetailsSub$) {
      this.publisherDetailsSub$.unsubscribe();
    }
  }
}


