import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatChipInputEvent,
  MatDialog,
  MatDialogRef,
} from '@angular/material';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UtilService } from '../../services/util.service';
import { PubManagementService } from '../services/pub-management.service';
import { EntityState, INITIAL_ENTITY_STATE } from '../../model/entity-state';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { NotificationsService } from 'angular2-notifications';
import { DataTable } from 'momentum-table';
import {
  BID_TYPES, EDIT_OPTIONS, FTP_CONFIG, Item, PLACEMENT_TYPES, PUB_CONTACT_DETAILS,
  PUB_PORTAL_DETAILS, PUB_RECONCILIATION_DETAILS
} from '../../model/entity';
import {
  FTPConfig, Publisher, PublisherContactDetails, PublisherPortalDetails,
  PublisherReconciliationDetails
} from "../../model/publisher";

@Component({
  selector: 'app-publisher-list',
  templateUrl: './publisher-list.component.html',
  styleUrls: ['./publisher-list.component.scss'],
})
export class PublisherListComponent implements OnInit {
  loading: boolean;
  agencies;
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

  bidTypes = BID_TYPES;

  placementTypes: Item[] = PLACEMENT_TYPES;

  editOptions: Item[] = EDIT_OPTIONS;

  constructor(
    private pubManagementService: PubManagementService,
    public dialog: MatDialog,
    private utilService: UtilService,
    private notifService: NotificationsService,
  ) {
    this.params = JSON.parse(JSON.stringify(INITIAL_ENTITY_STATE));

    utilService.getAgencies().subscribe(data => {
      this.agencies = data;
    });
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
      item => item.toLowerCase().indexOf(name.toLowerCase()) >= 0,
    );
  }

  getPublisherList() {
    this.loading = true;
    this.publishers = [];
    this.pubManagementService.getPublishers(this.params).subscribe(
      (res: any) => {
        this.loading = false;
        this.publisherResp = res.data;
        this.publishers = this.publisherResp.records;
        this.typeAhead = this.publisherResp.typeahead;
      },
      err => {
        this.loading = false;
      },
    );
  }

  openPublisherDialog(row) {
    const dialogRef = this.dialog.open(PublisherDialog, {
      width: '600px',
      data: row,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.getPublisherList();
        this.notifService.success(
          'Success',
          'New Publisher created successfully',
        );
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

  closeEditor() {
    const editedCell = this.table.editingCell;
    this.table.switchCellToViewMode(editedCell);
  }

  initEdit(val) {
    this.updateError = null;
  }

  updateValue(type, row, value) {
    if (type === 'minBid') {
      value = parseFloat(value);
    }
    this.updating = true;
    this.updateError = null;
    const updateObj = {
      id: row['placement'].id,
      update: {}
    };
    updateObj['update'][type] = value;
    this.pubManagementService.updatePublisher(updateObj).subscribe(
      res => {
        this.updating = false;
        this.closeEditor();
        row['placement'][type] = value;
        this.notifService.success('Success', 'Successfully updated');
      },
      err => {
        this.updating = false;
        this.updateError = 'Something went wrong, try again';
      },
    );
  }

  pauseClients(row) {
    this.updating = true;
    const updateObj = {
      id: row['placement'].id,
    };
    this.pubManagementService.pausePublisher({agency: this.selectedAgency}, updateObj).subscribe(
      res => {
        this.updating = false;
        this.closeEditor();
        this.notifService.success('Success', 'Successfully updated');
      },
      err => {
        this.updating = false;
        this.updateError = 'Something went wrong, try again';
      },
    );
  }

  onRowClick(row) {
    const dialogRef = this.dialog.open(PublisherInfoDiolog, {
      width: '60%',
      data: row,
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  editPublisher(editType) {
    const dialogRef = this.dialog.open(PublisherEditDiolog, {
      width: '60%',
      data: {
        publisher: this.selectedPublishers[0],
        type: editType
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.getPublisherList();
        this.notifService.success(
          'Success',
          'Successfully updated',
        );
      }
    });
  }
}

// Publisher info Dialog
@Component({
  selector: 'publisher-info-dialog',
  templateUrl: 'publisher-info-dialog.html',
  styleUrls: ['publisher-info-dialog.scss'],
})
export class PublisherInfoDiolog {
  constructor(
    public dialogRef: MatDialogRef<PublisherInfoDiolog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onCancel() {
    this.dialogRef.close();
  }
}


// Publisher Edit Dialog
@Component({
  selector: 'publisher-edit-dialog',
  templateUrl: 'publisher-edit-dialog.html',
  styleUrls: ['publisher-edit-dialog.scss'],
})
export class PublisherEditDiolog implements OnInit {
  type: string;
  loading: boolean;
  updateError: string;
  separatorKeysCodes = [ENTER, COMMA];
  ftpConfig: FormGroup;
  publisherPortalDetails: FormGroup;
  publisherContactDetails: FormGroup;
  publisherReconciliationDetails: FormGroup;

  ftpConfigData: FTPConfig;
  pubPortalDetailsData: PublisherPortalDetails;
  pubContactDetailsData: PublisherContactDetails;
  pubReconciliationDetailsData: PublisherReconciliationDetails;
  constructor(
    public dialogRef: MatDialogRef<PublisherEditDiolog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private pubManagementService: PubManagementService,
    public utilService: UtilService
  ) {
    this.populateData();
  }

  ngOnInit() {
    this.initFtpForm();
    this.initPubPortalForm();
    this.initPubContactForm();
    this.initPubReconciliationForm();
  }

  initFtpForm() {
    const host = this.ftpConfigData && this.ftpConfigData.credentials && this.ftpConfigData.credentials.host || '';
    const username = this.ftpConfigData && this.ftpConfigData.credentials && this.ftpConfigData.credentials.username || '';
    const password = this.ftpConfigData && this.ftpConfigData.credentials && this.ftpConfigData.credentials.password || '';
    const alertRecipients = this.ftpConfigData && this.ftpConfigData.alertRecipients || [];
    this.ftpConfig = new FormGroup({
      credentials: new FormGroup({
        host: new FormControl(host, Validators.required),
        username: new FormControl(username, Validators.required),
        password: new FormControl(password, Validators.required),
      }),
      alertRecipients: this.fb.array(alertRecipients),
    });
  }

  initPubPortalForm() {
    const url = this.pubPortalDetailsData && this.pubPortalDetailsData.url || '';
    const username = this.pubPortalDetailsData && this.pubPortalDetailsData.username || '';
    const password = this.pubPortalDetailsData && this.pubPortalDetailsData.password || '';
    this.publisherPortalDetails = new FormGroup({
      url: new FormControl(url),
      username: new FormControl(username),
      password: new FormControl(password),
    });
  }

  initPubContactForm() {
    const name = this.pubContactDetailsData && this.pubContactDetailsData.name || '';
    const phone = this.pubContactDetailsData && this.pubContactDetailsData.phone || '';
    const email = this.pubContactDetailsData && this.pubContactDetailsData.email || '';
    const billingEmail = this.pubContactDetailsData && this.pubContactDetailsData.billingEmail || '';
    this.publisherContactDetails = new FormGroup({
      name: new FormControl(name),
      phone: new FormControl(phone),
      email: new FormControl(email),
      billingEmail: new FormControl(billingEmail),
    });
  }

  initPubReconciliationForm() {
    const mode = this.pubReconciliationDetailsData && this.pubReconciliationDetailsData.mode || '';
    const startDate = this.pubReconciliationDetailsData && this.pubReconciliationDetailsData.startDate || '';
    const frequency = this.pubReconciliationDetailsData && this.pubReconciliationDetailsData.frequency || '';
    const timezone = this.pubReconciliationDetailsData && this.pubReconciliationDetailsData.timezone || '';
    this.publisherReconciliationDetails = new FormGroup({
      mode: new FormControl(mode),
      startDate: new FormControl(startDate),
      frequency: new FormControl(frequency),
      timezone: new FormControl(timezone),
    });
  }

  populateData() {
    switch (this.data.type) {
      case FTP_CONFIG :
        this.ftpConfigData = this.data.publisher.placement.ftpConfig;
        this.type = FTP_CONFIG.value;
        break;
      case PUB_PORTAL_DETAILS :
        this.pubPortalDetailsData = this.data.publisher.placement.publisherPortalDetails;
        this.type = PUB_PORTAL_DETAILS.value;
        break;
      case PUB_CONTACT_DETAILS :
        this.pubContactDetailsData = this.data.publisher.placement.publisherContactDetails;
        this.type = PUB_CONTACT_DETAILS.value;
        break;
      case PUB_RECONCILIATION_DETAILS :
        this.pubReconciliationDetailsData = this.data.publisher.placement.publisherReconciliationDetails;
        this.type = PUB_RECONCILIATION_DETAILS.value;
        break;
    }
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

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    let tempData = {
      id: this.data.publisher.placement.id,
      update: {}
    };
    tempData['update'][this.type] = this[this.type].value;
    console.log(tempData);
    this.loading = true;
    this.updateError = null;
    this.pubManagementService.updatePublisher(tempData).subscribe(
      res => {
        this.loading = false;
        this.dialogRef.close({ success: true });
      },
      err => {
        this.loading = false;
        this.updateError = 'Something went wrong, please try again.';
      },
    );
  }
}


// Publisher Add dialog
@Component({
  selector: 'publisher-dialog',
  templateUrl: 'publisher-dialog.html',
  styleUrls: ['publisher-dialog.scss'],
})
export class PublisherDialog implements OnInit, OnDestroy {
  loading: boolean;
  error: string;
  agencies: string[];
  bidTypes = BID_TYPES;
  placementTypes = PLACEMENT_TYPES;
  separatorKeysCodes = [ENTER, COMMA];

  public creationForm: FormGroup;
  ftpConfigSubscription$;

  constructor(
    public dialogRef: MatDialogRef<PublisherDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public utilService: UtilService,
    private pubManagementService: PubManagementService,
    private fb: FormBuilder,
  ) {
    utilService.getAgencies().subscribe(res => {
      this.agencies = res;
    });
  }

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
        placementType: new FormControl(),
        url: new FormControl('', Validators.required),
        country: new FormControl(),
        industry: new FormControl(),
        perClientPlacements: new FormControl(),
        category: new FormControl(),
        ftpConfig: new FormGroup({
          credentials: new FormGroup({
            host: new FormControl(),
            username: new FormControl(),
            password: new FormControl(),
          }),
          alertRecipients: new FormArray([]),
        }),
        publisherPortalDetails: new FormGroup({
          url: new FormControl(),
          username: new FormControl(),
          password: new FormControl(),
        }),
        publisherContactDetails: new FormGroup({
          name: new FormControl(),
          phone: new FormControl(),
          email: new FormControl(),
          billingEmail: new FormControl(),
        }),
        publisherReconciliationDetails: new FormGroup({
          mode: new FormControl(),
          startDate: new FormControl(),
          frequency: new FormControl(),
          timezone: new FormControl(),
        }),
      }),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
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
    ] = this.creationForm.value.placement['name'].trim().replace(/\./g, '_');

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
      },
    );
  }

  ngOnDestroy() {
    if (this.ftpConfigSubscription$) {
      this.ftpConfigSubscription$.unsubscribe();
    }
  }
}

