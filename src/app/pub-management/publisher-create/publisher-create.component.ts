import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {
  BID_TYPES
} from '../../model/entity';
import { UtilService } from '../../services/util.service';
import { PubManagementService } from '../services/pub-management.service';

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
  selectedAgency: string;
  additionalFields: any;
  editPublisher;
  error: string;
  bidTypes = BID_TYPES;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public utilService: UtilService,
    public pubManagementService: PubManagementService,
  ) { }

  ngOnInit() {

    this.publisherDetailsSub$ = this.pubManagementService.publisherDetailsObs$.subscribe(res => {
      if (res) {
        this.isModeEdit = true;
        this.editPublisher = res.publisher;
        this.selectedAgency = res.selectedAgency;
        this.additionalFields = res.additionalFields;
      }
    })
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
        agencyList: [],
        name: ['', Validators.required],
        bidType: ['', Validators.required],
        currency: ['', Validators.required],
        minBid: [],
        url: ['', Validators.required],
        country: [],
        industry: [],
        ftpConfig: this.fb.group({
          credentials: this.fb.group({
            host: [],
            username: [],
            password: [],
            pathTemplate: []
          })
        }),
        feedConfig: this.fb.group({
          feedType: '',
          compressFeed: ''
        }),
        vendorPortalDetails: this.fb.array([
          this.fb.group({
            url: [],
            username: [],
            password: []
          })
        ]),
        publisherContactDetailsR: this.fb.array([
          this.fb.group({
            email: [],
            vpAccessEnabled: [false],
            notificationEnabled: [false]
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
      const placementFields = this.editPublisher.placement;
      Object.keys(placementFields).forEach(item => {
        if (
          [
            'name',
            'currency',
            'minBid',
            'url',
            'country'
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
        } else if (item === 'publisherContactDetailsR') {
          const contactDetails = this.creationForm.controls.placement['controls'].publisherContactDetailsR as FormArray;
          contactDetails.removeAt(0);
          placementFields[item].forEach(details => {
            contactDetails.push(this.fb.group({
              email: [details.email],
              vpAccessEnabled: [details.vpAccessEnabled],
              notificationEnabled: [details.notificationEnabled]
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

  addPubContact() {
    const control = this.creationForm.controls['placement'].controls['publisherContactDetailsR'];
    control.push(this.fb.group({
      email: [],
      vpAccessEnabled: [false],
      notificationEnabled: [false]
    }))
  }
  removePubContact(index) {
    const control = this.creationForm.controls['placement'].controls['publisherContactDetailsR'];
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
    if (!this.isModeEdit) {
      dataObj['agencyList'] = dataObj.placement.agencyList;
    }
    delete dataObj.placement.agencyList;
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
    this.pubManagementService.updatePublisher(this.selectedAgency,dataObj).subscribe(
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
    this.router.navigate(['../details'], { relativeTo: this.route });
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


