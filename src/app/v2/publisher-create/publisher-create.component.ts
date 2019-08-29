import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {
  BID_TYPES
} from '../../model/entity';
import { FOREIGN_CLICKS_OPTIONS, DEF_PRESETS, FEED_TYPES} from '../utils/util';
import { UtilService } from '../../services/util.service';
import { BreadcrumbSegment } from '../../core/components/breadcrumb/breadcrumb.model';
import { PubManagementService } from '../../pub-management/services/pub-management.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-publisher-create',
  templateUrl: './publisher-create.component.html',
  styleUrls: ['./publisher-create.component.scss']
})
export class PublisherCreateComponent implements OnInit, OnDestroy {
  uploadingFile: boolean;
  loading: boolean;
  
  creationForm;
  ftpConfigSubscription$;
  publisherDetailsSub$
  clients = [];
  clientDefs = [];
  
  flatBidPublisher = false;
  isModeEdit = false;
  enableClickDefs = false;
  editPublisher;
  error: string;
  bidTypes = BID_TYPES;
  feedTypes = FEED_TYPES;
  agency: string;
  botFile: string;
  foreignClicksOptions: any[] = FOREIGN_CLICKS_OPTIONS;
  defPresets = DEF_PRESETS;
  breadcrumbSegments: BreadcrumbSegment[] = [];  

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public utilService: UtilService,
    public pubManagementService: PubManagementService,
    public notifService: NotificationsService
  ) { }

  ngOnInit() {
    if ( this.route.snapshot.data.data) {
      this.isModeEdit = true;
      this.editPublisher = this.route.snapshot.data.data;
    }
    if (this.route.snapshot.data.routeType === "agency") {
      this.enableClickDefs = true;
      this.agency = this.route.snapshot.params.agencyId;
      this.clients = this.route.snapshot.data.clients;
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
        perClientPlacements: false,
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
      this.bindEditData();
    }
  }

  bindEditData() {
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
      }  else if (item === 'clickDefinitions' && this.agency) {
        const agencyDef =
          placementFields[item].agencies[this.agency].definition;

        if (placementFields[item].agencies[this.agency].botIpsFileUrl) {
          this.botFile =
            placementFields[item].agencies[this.agency].botIpsFileUrl;
        }
        this.clientDefs = [this.encodeClickDef(agencyDef)];
        const allClientsMap = placementFields[item].agencies[this.agency].clients;

// wait until clients exist
        Object.keys(allClientsMap).forEach(client => {
          if (!client) {
            return;
          }
          const selectedClient = this.clients.filter(
            c => c.id === client
          )[0];
          this.clientDefs = this.clientDefs.concat([
            this.encodeClickDef(
              allClientsMap[client].definition,
              selectedClient
            )
          ]);
        });
      }
    });
  }

  buildBreadcrumb() {
    let subSegment;
    if (!this.isModeEdit) {
      this.breadcrumbSegments = [
        { 
          label: "All Publishers", 
          url: ["../../", "publishers"] 
        },
        {
          label: "Add Publisher"
        }
      ];

    } else  if (this.isModeEdit && !this.enableClickDefs) {
      this.breadcrumbSegments = [
        { 
          label: "All Publishers", 
          url: ["../../..", "publishers"] 
        },
        {
          label: "Edit Publisher : ",
          subTitle: this.editPublisher.placement.name
        }
      ];
    } else {
      this.breadcrumbSegments = [
        { 
          label: "All Agencies", 
          url: ["/","v2", "agencies"] 
        }, 
        { 
          label: "Agency : ", 
          subTitle: this.agency
        },
        { 
          label: "All Publishers", 
          url: ["../../..", "publishers"] 
        },
        {
          label: "Edit Publisher : ",
          subTitle: this.editPublisher.placement.name
        }]
    }
    
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
  changeVpAccess(pubContact) {
    const vpAccessValue = pubContact.controls.vpAccessEnabled.value;
    pubContact.controls.email.setValidators(vpAccessValue ? Validators.required : '');
    pubContact.controls.email.updateValueAndValidity( {emitEvent: false});
  }
  changeSendNotification (pubContact) {
    const sendNotifValue = pubContact.controls.notificationEnabled.value;
    pubContact.controls.notificationAlertThreshold.setValidators(sendNotifValue ? Validators.required : '');
    pubContact.controls.notificationAlertThreshold.updateValueAndValidity( {emitEvent: false});
  }
  getFieldErrorMessage(error) {
    const first = Object.keys(error)[0];
    return first === 'pattern'
    ? 'Only following special characters allowed . - _ ()'
    : 'Name is required';
  }
  toogleCHDefs(row, definition) {
    row[definition] = !row[definition];
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
      if (this.agency) {
        this.bindClickDefs(dataObj);
        const updatedData = {
          agencyId: this.agency,
          placement: dataObj.placement
        }
        this.agencyUpdatePublisher(updatedData);
      } else {
        const updatedData = {
          id: dataObj.placement.id,
          update: {}
        };
        updatedData['update']= dataObj.placement;
        this.updatePublisher(updatedData);
      }
    }
    
  }
  
  bindClickDefs(dataObj) {
    dataObj.placement['clickDefinitions'] = {
      agencies: {
        [this.agency]: {
          clients: {},
          definition: {},
          botIpsFileUrl: this.botFile
        }
      }
    };

    this.clientDefs.forEach(def => {
      if (def.type === 'agency') {
        dataObj.placement.clickDefinitions.agencies[this.agency][
          'definition'
        ] = this.decodeClickDef(def);
      } else {
        dataObj.placement.clickDefinitions.agencies[this.agency].clients[
          def.id
        ] = {};
        dataObj.placement.clickDefinitions.agencies[this.agency].clients[
          def.id
        ]['definition'] = this.decodeClickDef(def);
      }
    });
  }

  addPublisher(dataObj) {
    this.pubManagementService.addPublisher(dataObj).subscribe(
      res => {
        this.loading = false;
        this.notifService.success('Success', 'Successfully created');        
        this.navigateBack();
      },
      err => {
        this.error = 'something went wrong, please try again';
        this.notifService.error('Error', this.error);
        this.loading = false;
      }
    );
  }
  
  updatePublisher(dataObj) {
    let agency = this.agency || 'All Agencies';
    this.pubManagementService.updatePublisher(agency,dataObj).subscribe(
      res => {
        this.loading = false;
        this.notifService.success('Success', 'Successfully updated');        
        this.navigateBack();
      },
      err => {
        this.error = 'something went wrong, please try again';
        this.notifService.error('Error', this.error);        
        this.loading = false;
      }
    );
  }
  agencyUpdatePublisher(dataObj) {
    this.pubManagementService.updateAgencyPublisher(dataObj).subscribe(
      res => {
        this.loading = false;
        this.notifService.success('Success', 'Successfully updated');        
        this.navigateBack();
      },
      err => {
        this.error = 'something went wrong, please try again';
        this.notifService.error('Error', this.error);        
        this.loading = false;
      }
    );
  }
  
  
  navigateBack() {
    this.pubManagementService.setPublisherData(null);
    this.router.navigate([this.isModeEdit ? '../../../publishers' :'../../publishers'], { relativeTo: this.route });
  }
  
  deleteClientCong(row, rowIndex) {
    this.clientDefs.splice(rowIndex, 1);
    this.clientDefs = [...this.clientDefs];
  }

  decodeClickDef(def) {
    const obj = {};
    Object.keys(def).forEach(item => {
      if (['enable', 'createdAt', 'updatedAt', 'bot'].includes(item)) {
        obj[item] = def[item];
      }
    });
    if (def.allowDuplicate) {
      obj['duplicate'] = def.duplicate / 1000;
    }
    if (def.allowLatent) {
      obj['latent'] = def.latent / 1000;
    }
    if (def.allowForeign) {
      obj['foreign'] = def.foreign;
    }
    return obj;
  }

  encodeClickDef(def, selectedClient?) {
    const obj = {
      name: selectedClient ? selectedClient.name : 'All Clients',
      id: selectedClient ? selectedClient.id : this.agency,
      preset: {},
      bot: def.bot,
      allowDuplicate: !!def.duplicate,
      duplicate: def.duplicate ? def.duplicate * 1000 : 0,
      allowForeign: !!def.foreign,
      foreign: def.foreign,
      allowLatent: !!def.latent,
      latent: def.latent ? def.latent * 1000 : 0,
      type: selectedClient ? null : 'agency',
      enable: def.enable,
      createdAt: def.createdAt,
      updatedAt: def.updatedAt
    };

    if (selectedClient) {
      obj['selectedClient'] = selectedClient;
    }

    return obj;
  }

  uploadBotFile($event) {
    const files = (<HTMLInputElement>event.target).files;
    this.uploadingFile = true;
    this.pubManagementService
      .uploadBotFile(files[0], 'customfiles', this.agency)
      .subscribe((response: any) => {
        this.uploadingFile = false;
        this.loading = false;
        console.log(response);
        if (response.data && !response.data.success) {
        this.notifService.error('Error', response.data.error.msg);
          return;
        }
        this.botFile = response.data.id;
        this.notifService.success('Success', 'Successfully uploaded');

      });
  }

  download() {
    window.open(this.botFile, '_blank');
  }
  downloadSampleCSV() {
    const header = ['IP Address'];
    const data = [{ IpAddress: '31.2.43' }, { IpAddress: '172.4.00' }];
    this.utilService.downloadCSV(header, data, 'Sample Bot Ips');
  }

  perClientChange(val) {
    if (!val.checkecd) {
      this.clientDefs = [this.clientDefs[0]];
    }
  }

  changePreset(event, row) {
    row.allowDuplicate = !!event.value.duplicate;
    row.duplicate = event.value.duplicate;

    row.allowLatent = !!event.value.latent;
    row.latent = event.value.latent;

    row.allowForeign = !!event.value.foreign;
    row.foreign = event.value.foreign;

    row.bot = !!event.value.bot;
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


