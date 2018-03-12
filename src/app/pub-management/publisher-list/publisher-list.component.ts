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
import { BID_TYPES, PLACEMENT_TYPES } from '../../model/entity';
import {PublisherDetailDialogComponent} from "../../pub-monitor/publishers/publishers.component";

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

  public typeAhead = [];
  typeAheadController: FormControl;
  filteredOptions: Observable<any[]>;

  updating: boolean;
  @ViewChild(DataTable) table: DataTable;

  bidTypes = BID_TYPES;

  placementTypes = PLACEMENT_TYPES;

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
        console.log(this.publisherResp);
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

  updateValue(type, row, value) {
    if (type === 'minBid') {
      value = parseFloat(value);
    }
    this.updating = true;
    const updateObj = {
      id: row['placement'].id,
    };
    updateObj[type] = value;
    this.pubManagementService.updatePublisher(updateObj).subscribe(
      res => {
        this.updating = false;
        this.closeEditor();
        row['placement'][type] = value;
        this.notifService.success('Success', 'Successfully updated');
      },
      err => {
        this.updating = false;
      },
    );
  }

  onRowClick(row) {
    const dialogRef = this.dialog.open(PublisherInfoDiolog, {
      width: '60%',
      data: row,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.notifService.success(
          'Success',
          'New Publisher created successfully',
        );
      }
    });
  }
}

@Component({
  selector: 'publisher-detail-dialog',
  templateUrl: 'publisher-info-dialog.html',
  styleUrls: ['publisher-info-dialog.scss'],
})
export class PublisherInfoDiolog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PublisherInfoDiolog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    console.log(this.data);
  }

}

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

  countries: string[];
  industries: string[];
  categories: string[];
  currencies: string[];
  modesOfFile: string[];

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
    this.loadEnums();
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

  loadEnums() {
    this.pubManagementService.getEnums('country').subscribe(res => {
      this.countries = res;
    });
    this.pubManagementService.getEnums('industry').subscribe(res => {
      this.industries = res;
    });
    this.pubManagementService.getEnums('category').subscribe(res => {
      this.categories = res;
    });
    this.pubManagementService.getEnums('currency').subscribe(res => {
      this.currencies = res;
    });
    this.pubManagementService.getEnums('modeOfFile').subscribe(res => {
      this.modesOfFile = res;
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
        console.log(res);
        this.loading = false;
        this.dialogRef.close({ success: true });
      },
      err => {
        console.log(err);
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

