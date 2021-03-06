import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatChipInputEvent,
  MatDialog,
  MatDialogRef
} from '@angular/material';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UtilService } from '../services/util.service';
import { PubManagementService } from './services/pub-management.service';
import { EntityState, INITIAL_ENTITY_STATE } from '../model/entity-state';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { NotificationsService } from 'angular2-notifications';
import { DataTable } from 'momentum-table';
import {
  BID_TYPES,
  EDIT_OPTIONS,
  Item,
  PLACEMENT_TYPES
} from '../model/entity';
import { Publisher } from '../model/publisher';

@Component({
  selector: 'app-publisher-list',
  templateUrl: './pub-management.component.html',
  styleUrls: ['./pub-management.component.scss']
})
export class PublisherListComponent implements OnInit {
  loading: boolean;
  publisherResp: any;
  publishers: Object[] = [];
  params: EntityState;

  selectedAgency = 'All Agencies';

  selectedPublishers = [];

  public typeAhead = [];
  typeAheadController: FormControl;
  filteredOptions: Observable<any[]>;

  updating: boolean;
  updateError: string;
  @ViewChild(DataTable) table: DataTable;

  bidTypes: Item[] = BID_TYPES;

  placementTypes: Item[] = PLACEMENT_TYPES;

  editOptions: Item[] = EDIT_OPTIONS;

  public interval;

  constructor(
    private pubManagementService: PubManagementService,
    public dialog: MatDialog,
    private utilService: UtilService,
    private notifService: NotificationsService
  ) {
    this.params = JSON.parse(JSON.stringify(INITIAL_ENTITY_STATE));
  }

  ngOnInit() {
    this.getPublisherList();

    this.typeAheadController = new FormControl();
    this.filteredOptions = this.typeAheadController.valueChanges
      .startWith(null)
      .map(query => {
        return query ? this.filterOptions(query) : this.typeAhead.slice();
      });
  }

  filterOptions(name: string) {
    return this.typeAhead.filter(
      item => item.toLowerCase().indexOf(name.toLowerCase()) >= 0
    );
  }

  getPublisherList() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.loading = true;
    this.publishers = [];
    this.selectedPublishers = [];
    this.pubManagementService.getPublishers(this.params).subscribe(
      (res: any) => {
        this.loading = false;
        this.publishers = res.data.records;
        this.typeAhead = res.data.typeahead;

        this.publishers.map((pub: any) => {
          if (pub.feedFileInfo && pub.feedFileInfo.toggleTimestamp) {
            pub.feedFileInfo['timeElapsed'] =
              Date.now() - pub.feedFileInfo.toggleTimestamp;
          }
          if (
            pub.outboundFileToggleTimestamp &&
            pub['placement']['perClientPlacements']
          ) {
            pub['elapsedOutboundTimestamp'] =
              Date.now() - pub.outboundFileToggleTimestamp;
          }
        });


        this.interval = setInterval(() => {
          this.publishers.map((pub: any) => {
            if (
              pub.feedFileInfo &&
              pub.feedFileInfo['timeElapsed'] < 259200000
            ) {
              pub.feedFileInfo['timeElapsed'] += 60000;
            }
            if (pub['elapsedOutboundTimestamp'] < 259200000) {
              pub.elapsedoutboundTimestamp += 60000;
            }
          });
        }, 60000);
      },
      err => {
        this.loading = false;
      }
    );
  }

  getRemainingHours(timestamp) {
    // if (row['feedFileInfo'].timeElapsed) {
    //   const remainingHrs = Math.ceil((259200000 - row['feedFileInfo'].timeElapsed) / (1000 * 60 * 60));
    //   return remainingHrs >= 0 ? remainingHrs : null;
    // } else {
    //   return null;
    // }

    if (timestamp) {
      const remainingHrs = Math.ceil(
        (259200000 - timestamp) / (1000 * 60 * 60)
      );
      return remainingHrs >= 0 ? remainingHrs : null;
    }
    return null;
  }

  openPublisherAddDialog(row) {
    const dialogRef = this.dialog.open(PublisherAddDialog, {
      width: '800px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.getPublisherList();
        this.notifService.success(
          'Success',
          'New Publisher created successfully'
        );
      }
    });
  }

  openPublisherSchemaDialog() {
    const dialogRef = this.dialog.open(PublisherSchemaDialog, {
      width: '80vw',
      data: {
        publisher: this.selectedPublishers[0],
        selectedAgency: this.selectedAgency
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.notifService.success('Success', 'Successfully updated');
      }
    });
  }

  onAgencyChange(agency?) {
    this.params.agencyId = agency ? agency : null;
    this.getPublisherList();
  }

  onQuerySearch(query) {
    this.params.query = query;
    this.getPublisherList();
  }

  onSortChange(sortData) {
    this.params.sortOrder = sortData.order === -1 ? 'desc' : 'asc';
    this.params.fields = sortData.field;
    this.getPublisherList();
  }

  onPageChange(pageData) {
    this.params.page = pageData.pageIndex + 1;
    this.params.limit = pageData.pageSize;
    this.getPublisherList();
  }

  onRefresh() {
    this.getPublisherList();
  }

  initEdit(val) {
    this.updateError = null;
  }

  getBidDisplayValue(publisher) {
    if (publisher['bidType']['name'] === 'FLAT_CPC') {
      return publisher['flatBidValue'];
    } else {
      return publisher['minBid'] ? publisher['minBid'] : '-';
    }
  }

  updateValue(type, row, value) {
    if (type === 'feedIndexLatency') {
      value = parseFloat(value);
    }
    if (type === 'minBid') {
      value = parseFloat(value);
      type = (row['placement']['bidType']['name'] === 'FLAT_CPC') ? 'flatBidValue' : 'minBid';
    }
    this.updating = true;
    this.updateError = null;
    const updateObj = {
      id: row['placement'].id,
      update: {}
    };
    updateObj['update'][type] = value;
    this.pubManagementService.updatePublisher(this.selectedAgency, updateObj).subscribe(
      res => {
        this.updating = false;
        this.closeEditor();
        if (type === 'feedFileType') {
          row['feedFileInfo']['fileType'] = value;
          if (!row['feedFileInfo']['toggleTimestamp']){
            row['feedFileInfo']['toggleTimestamp'] = new Date();
            row['feedFileInfo']['timeElapsed'] = 1000;
          }
        } else if (type === 'perClientPlacements' && value) {
          row['elapsedOutboundTimestamp'] = 1000;
          row['placement']['perClientPlacements'] = value;
        }  else {
          row['placement'][type] = value;
        }
        this.notifService.success('Success', 'Successfully updated');
      },
      err => {
        this.updating = false;
        this.updateError = 'Something went wrong, try again';
      }
    );
  }

  closeEditor() {
    const editedCell = this.table.editingCell;
    this.table.switchCellToViewMode(editedCell);
  }

  pauseClients(row) {
    this.updating = true;
    const updateObj = {
      id: row['placement'].id
    };
    this.pubManagementService
      .pausePublisher({ agency: this.selectedAgency }, updateObj)
      .subscribe(
        res => {
          this.updating = false;
          this.closeEditor();
          this.notifService.success('Success', 'Successfully updated');
        },
        err => {
          this.updating = false;
          this.updateError = 'Something went wrong, try again';
        }
      );
  }

  openPublisherInfoDialog(row) {
    this.dialog.open(PublisherInfoDialog, {
      width: '70%',
      data: row
    });
  }

  editPublisher(editType) {
    const dialogRef = this.dialog.open(PublisherEditDialog, {
      width: '60%',
      data: {
        publisher: this.selectedPublishers[0],
        type: editType,
        selectedAgency: this.selectedAgency
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.getPublisherList();
        this.notifService.success('Success', 'Successfully updated');
      }
    });
  }
}

// Publisher Schema Mapping Dialog
@Component({
  selector: 'publisher-schema-dialog',
  templateUrl: 'dialogs/publisher-schema-dialog.html',
  styleUrls: ['dialogs/publisher-schema-dialog.scss']
})
export class PublisherSchemaDialog implements OnInit {
  loading: boolean;
  schemaMapping;
  additionalFields: string[];
  additionalFieldsV2: object;
  additionalFieldsV2Arr: any[] = [];
  fieldsWrappedInCdata = {};
  includeCurrencyInBidTag: boolean;
  headerSchema;
  constructor(
    public dialogRef: MatDialogRef<PublisherSchemaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pubManagementService: PubManagementService,
    private utilService: UtilService
  ) {
    this.schemaMapping = {
      job: '',
      company: '',
      title: '',
      city: '',
      state: '',
      country: '',
      description: '',
      url: '',
      zip: '',
      category: '',
      refNumber: '',
      modifiedDate: '',
      publishedDate: '',
      advertiser: '',
      cpc: '',
      cpa: ''
    };
    this.headerSchema = {
      publisherName: '',
      publisherUrl: '',
      jobCount: '',
      generationTime: ''
    };
  }

  ngOnInit() {
    this.loading = true;
    this.pubManagementService
      .getPublisherSchema(this.data.selectedAgency, this.data.publisher.placement.id)
      .subscribe(
        res => {
          this.loading = false;
          this.includeCurrencyInBidTag = res.includeCurrencyInBidTag;
          const fieldsWrappedInCdata = res.fieldsWrappedInCdata;
          fieldsWrappedInCdata.map(item => {
            this.fieldsWrappedInCdata[item] = true;
          });
          this.additionalFieldsV2 = res.additionalFieldsV2;
          Object.keys(this.additionalFieldsV2).forEach(item => {
            const cData = fieldsWrappedInCdata.includes(item);
            this.additionalFieldsV2Arr.push({
              key: item,
              value: this.additionalFieldsV2[item],
              cData: cData
            });
          });

          Object.assign(this.schemaMapping, res.jobSchema);
          Object.assign(this.headerSchema, res.headerSchema);
        },
        err => {
          this.loading = false;
        }
      );
  }

  trackByFn(index, item) {
    return index;
  }

  addCustomNode() {
    this.additionalFieldsV2Arr.push({ key: '', value: '', cData: false });
  }

  removeNode(index) {
    this.additionalFieldsV2Arr.splice(index, 1);
  }

  onSubmit() {
    const data = {
      schema: {}
    };
    this.utilService.objectCleaner(this.schemaMapping);
    this.utilService.objectCleaner(this.headerSchema);
    data.schema['fieldsWrappedInCdata'] = Object.keys(
      this.fieldsWrappedInCdata
    ).filter(key => this.fieldsWrappedInCdata[key]);
    data.schema['jobSchema'] = this.schemaMapping;
    data.schema['additionalFields'] = [];
    data.schema['headerSchema'] = this.headerSchema;
    data.schema['includeCurrencyInBidTag'] = this.includeCurrencyInBidTag;

    data.schema['additionalFieldsV2'] = {};

    this.additionalFieldsV2Arr.forEach(item => {
      data.schema['additionalFieldsV2'][item.key] = item.value;

      if (item.cData) {
        data.schema['fieldsWrappedInCdata'].push(item.key);
      }
    });

    this.pubManagementService
      .postPublisherSchema(this.data.selectedAgency, this.data.publisher.placement.id, data)
      .subscribe(res => {
        this.dialogRef.close({ success: true });
      });
  }
}

// Publisher info Dialog
@Component({
  selector: 'publisher-info-dialog',
  templateUrl: 'dialogs/publisher-info-dialog.html',
  styleUrls: ['dialogs/publisher-info-dialog.scss']
})
export class PublisherInfoDialog {
  constructor(
    public dialogRef: MatDialogRef<PublisherInfoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}

// Publisher Edit Dialog
@Component({
  selector: 'publisher-edit-dialog',
  templateUrl: 'dialogs/publisher-edit-dialog.html',
  styleUrls: ['dialogs/publisher-edit-dialog.scss']
})
export class PublisherEditDialog implements OnInit {
  type: string;
  loading: boolean;
  updateError: string;
  separatorKeysCodes = [ENTER, COMMA];

  ftpConfig: FormGroup;
  publisherPortalDetails: FormGroup;
  publisherContactDetails: FormGroup;
  publisherReconciliationDetails: FormGroup;
  agencies: FormGroup;

  agenciesData: any;
  publisherData: Publisher;
  constructor(
    public dialogRef: MatDialogRef<PublisherEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private pubManagementService: PubManagementService,
    public utilService: UtilService
  ) {
    this.agenciesData = this.data.publisher.additionalFields.agencyList;
    this.publisherData = this.data.publisher.placement;
    this.type = this.data.type.value;
  }

  ngOnInit() {
    this.initFtpForm();
    this.initPubPortalForm();
    this.initPubContactForm();
    this.initPubReconciliationForm();
    this.initAgenciesForm();
  }

  initFtpForm() {
    const host =
      (this.publisherData.ftpConfig &&
        this.publisherData.ftpConfig.credentials &&
        this.publisherData.ftpConfig.credentials.host) ||
      '';
    const username =
      (this.publisherData.ftpConfig &&
        this.publisherData.ftpConfig.credentials &&
        this.publisherData.ftpConfig.credentials.username) ||
      '';
    const password =
      (this.publisherData.ftpConfig &&
        this.publisherData.ftpConfig.credentials &&
        this.publisherData.ftpConfig.credentials.password) ||
      '';
    const alertRecipients =
      (this.publisherData.ftpConfig &&
        this.publisherData.ftpConfig.alertRecipients) ||
      [];
    this.ftpConfig = new FormGroup({
      credentials: new FormGroup({
        host: new FormControl(host, Validators.required),
        username: new FormControl(username, Validators.required),
        password: new FormControl(password, Validators.required)
      }),
      alertRecipients: this.fb.array(alertRecipients)
    });
  }

  initPubPortalForm() {
    const url =
      (this.publisherData.publisherPortalDetails &&
        this.publisherData.publisherPortalDetails.url) ||
      '';
    const username =
      (this.publisherData.publisherPortalDetails &&
        this.publisherData.publisherPortalDetails.username) ||
      '';
    const password =
      (this.publisherData.publisherPortalDetails &&
        this.publisherData.publisherPortalDetails.password) ||
      '';
    this.publisherPortalDetails = new FormGroup({
      url: new FormControl(url),
      username: new FormControl(username),
      password: new FormControl(password)
    });
  }

  initPubContactForm() {
    const name =
      (this.publisherData.publisherContactDetails &&
        this.publisherData.publisherContactDetails.name) ||
      '';
    const phone =
      (this.publisherData.publisherContactDetails &&
        this.publisherData.publisherContactDetails.phone) ||
      '';
    const email =
      (this.publisherData.publisherContactDetails &&
        this.publisherData.publisherContactDetails.email) ||
      '';
    const billingEmail =
      (this.publisherData.publisherContactDetails &&
        this.publisherData.publisherContactDetails.billingEmail) ||
      '';
    this.publisherContactDetails = new FormGroup({
      name: new FormControl(name),
      phone: new FormControl(phone),
      email: new FormControl(email),
      billingEmail: new FormControl(billingEmail)
    });
  }

  initPubReconciliationForm() {
    const mode =
      (this.publisherData.publisherReconciliationDetails &&
        this.publisherData.publisherReconciliationDetails.mode) ||
      '';
    const startDate =
      (this.publisherData.publisherReconciliationDetails &&
        this.publisherData.publisherReconciliationDetails.startDate) ||
      '';
    const frequency =
      (this.publisherData.publisherReconciliationDetails &&
        this.publisherData.publisherReconciliationDetails.frequency) ||
      '';
    const timezone =
      (this.publisherData.publisherReconciliationDetails &&
        this.publisherData.publisherReconciliationDetails.timezone) ||
      '';
    this.publisherReconciliationDetails = new FormGroup({
      mode: new FormControl(mode),
      startDate: new FormControl(new Date(startDate)),
      frequency: new FormControl(frequency),
      timezone: new FormControl(timezone)
    });
  }

  // getAgencyOptions() {
  //   const selectedAgencies = this.agenciesData.map(agency => {
  //     return { canRemove: false, id: agency };
  //   });
  //   const allAgencies = this.utilService.agencies.map(agency => {
  //     return { canRemove: true, id: agency };
  //   });
  //   return
  // }

  initAgenciesForm() {
    this.agencies = new FormGroup({
      selected: new FormControl(this.agenciesData)
    });
  }

  removeRecipient(index): void {
    if (index >= 0) {
      const recipients = this.ftpConfig.controls.alertRecipients as FormArray;
      recipients.removeAt(index);
    }
  }

  addRecipient(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const recipients = this.ftpConfig.controls.alertRecipients as FormArray;
      recipients.push(this.fb.control(value.trim()));
    }

    if (input) {
      input.value = '';
    }
  }

  isFormValid() {
    return this[this.type].valid;
  }

  onSubmit() {
    const tempData = {
      id: this.data.publisher.placement.id,
      update: {}
    };
    tempData['update'][this.type] = this[this.type].value;
    this.loading = true;
    this.updateError = null;
    if (this.type === 'agencies') {
      this.pubManagementService
        .updatePublisherAgencies(
          this.publisherData.id,
          this[this.type].value.selected
        )
        .subscribe(
          res => {
            this.loading = false;
            this.dialogRef.close({ success: true });
          },
          err => {
            this.loading = false;
            this.updateError = 'Something went wrong, please try again.';
          }
        );
    } else {
      this.pubManagementService.updatePublisher(this.data.selectedAgency, tempData).subscribe(
        res => {
          this.loading = false;
          this.dialogRef.close({ success: true });
        },
        err => {
          this.loading = false;
          this.updateError = 'Something went wrong, please try again.';
        }
      );
    }
  }
}

// Publisher Add dialog
@Component({
  selector: 'publisher-add-dialog',
  templateUrl: 'dialogs/publisher-add-dialog.html',
  styleUrls: ['dialogs/publisher-add-dialog.scss']
})
export class PublisherAddDialog implements OnInit, OnDestroy {
  loading: boolean;
  error: string;
  bidTypes = BID_TYPES;
  placementTypes = PLACEMENT_TYPES;
  separatorKeysCodes = [ENTER, COMMA];

  public creationForm: FormGroup;
  ftpConfigSubscription$;

  flatBidPublisher: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PublisherAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public utilService: UtilService,
    private pubManagementService: PubManagementService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
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
    this.creationForm = new FormGroup({
      agencyList: new FormControl([], Validators.required),
      placement: new FormGroup({
        name: new FormControl('', Validators.required),
        bidType: new FormControl('', Validators.required),
        currency: new FormControl('', Validators.required),
        minBid: new FormControl(),
        flatBidValue: new FormControl(),
        placementType: new FormControl('', Validators.required),
        url: new FormControl('', Validators.required),
        country: new FormControl(),
        industry: new FormControl(),
        perClientPlacements: new FormControl(),
        category: new FormControl(),
        ftpConfig: new FormGroup({
          credentials: new FormGroup({
            host: new FormControl(),
            username: new FormControl(),
            password: new FormControl()
          }),
          alertRecipients: new FormArray([])
        }),
        publisherPortalDetails: new FormGroup({
          url: new FormControl(),
          username: new FormControl(),
          password: new FormControl()
        }),
        publisherContactDetails: new FormGroup({
          name: new FormControl('', Validators.required),
          phone: new FormControl('', Validators.required),
          email: new FormControl('', Validators.required),
          billingEmail: new FormControl('', Validators.required)
        }),
        publisherReconciliationDetails: new FormGroup({
          mode: new FormControl(),
          startDate: new FormControl(),
          frequency: new FormControl(),
          timezone: new FormControl()
        })
      })
    });
  }

  getFieldErrorMessage(error) {
    const first = Object.keys(error)[0];
    return first === 'pattern'
      ? 'Only following special characters allowed . - _ ()'
      : 'Name is required';
  }

  onBidTypeChange(selectVal) {
    this.creationForm.get('placement').get('flatBidValue').setValue(null);
    if (selectVal.value === 'FLAT_CPC') {
      this.flatBidPublisher = true;
      this.creationForm.get('placement').get('flatBidValue').setValidators([Validators.required]);
    } else {
      this.flatBidPublisher = false;
      this.creationForm.get('placement').get('flatBidValue').setValidators(null);
    }
    this.creationForm.get('placement').get('flatBidValue').updateValueAndValidity({ emitEvent: false });
  }

  onSubmit() {
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

  removeRecipient(index): void {
    if (index >= 0) {
      const recipients = this.creationForm.controls.placement['controls']
        .ftpConfig.controls.alertRecipients as FormArray;
      recipients.removeAt(index);
    }
  }

  addRecipient(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const recipients = this.creationForm.controls.placement['controls']
        .ftpConfig.controls.alertRecipients as FormArray;
      recipients.push(this.fb.control(value.trim()));
    }

    if (input) {
      input.value = '';
    }
  }

  createPublisher() {
    this.creationForm.value.placement[
      'value'
    ] = this.creationForm.value.placement['name']
      .replace(/\s/g, '_')
      .replace(/\./g, '_');

    if (this.flatBidPublisher) {
      delete this.creationForm.value.placement['minBid'];
    } else {
      delete this.creationForm.value.placement['flatBidValue'];
    }

    const dataObj = this.creationForm.value;
    this.loading = true;
    this.error = null;
    this.pubManagementService.addPublisher(dataObj).subscribe(
      res => {
        this.loading = false;
        this.dialogRef.close({ success: true });
      },
      err => {
        this.error = 'something went wrong, please try again';
        this.loading = false;
      }
    );
  }

  ngOnDestroy() {
    if (this.ftpConfigSubscription$) {
      this.ftpConfigSubscription$.unsubscribe();
    }
  }
}
