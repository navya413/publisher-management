import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatChipInputEvent,
  MatDialog,
  MatDialogRef,
} from '@angular/material';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UtilService } from '../../services/util.service';
import { PubManagementService } from '../services/pub-management.service';
import { EntityState, INITIAL_ENTITY_STATE } from '../../model/entity-state';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { NotificationsService } from 'angular2-notifications';
import {DataTable} from 'momentum-table';

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

  public typeAhead = [];
  typeAheadController: FormControl;
  filteredOptions: Observable<any[]>;

  updating: boolean;
  @ViewChild(DataTable) table: DataTable;

  bidTypes = [
    { name: 'CPC', value: 'CPC' },
    { name: 'CPA', value: 'CPA' },
    { name: 'Organic', value: 'Organic' },
    { name: 'PPP', value: 'PPP' },
  ];

  placementTypes = [
    { name: 'Job Board', value: 'JobBoard' },
    { name: 'Direct Employer', value: 'DirectEmployer' },
    { name: 'All', value: 'All' }
  ]

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

  onAgencyChange(agency) {
    this.params.agencyId = agency;

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

  closeEditor() {
    const editedCell = this.table.editingCell;
    this.table.switchCellToViewMode(editedCell);
  }
  updateValue(type, row, value) {
    if(type === 'minBid'){
      value = parseFloat(value);
    }
    this.updating = true;
    const updateObj = {
      id: row.id,
    };
    updateObj[type] = value;
    console.log(updateObj);
    this.pubManagementService.updatePublisher(updateObj).subscribe(res => {
      console.log(res);
      this.updating = false;
      this.closeEditor();
      row[type] = value;
      this.notifService.success('Success', 'Successfully updated');
    }, err => {
      console.log(err);
      this.updating = false;
    });
  }

  rowExpanded(val) {
    console.log(val);
  }

  rowCollapse(val) {
    console.log(val);
  }
}

@Component({
  selector: 'publisher-dialog',
  templateUrl: 'publisher-dialog.html',
  styleUrls: ['publisher-dialog.scss'],
})
export class PublisherDialog {
  loading: boolean;
  error: string;
  agencies: string[];
  bidTypes = [
    { name: 'CPC', value: 'CPC' },
    { name: 'CPA', value: 'CPA' },
    { name: 'Organic', value: 'Organic' },
    { name: 'PPP', value: 'PPP' }
  ];
  placementTypes = [
    { name: 'Job Board', value: 'JobBoard' },
    { name: 'Direct Employer', value: 'DirectEmployer' },
    { name: 'All', value: 'All' }
  ];
  ftpEnabled: boolean;
  recipients = [];
  separatorKeysCodes = [ENTER, COMMA];

  dataObj = {
    agencyList: [],
    placement: {
      outboundFtp: {},
    },
  };

  constructor(
    public dialogRef: MatDialogRef<PublisherDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public utilService: UtilService,
    private pubManagementService: PubManagementService,
  ) {
    utilService.getAgencies().subscribe(res => {
      this.agencies = res;
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  removeRecipient(recipient: any): void {
    const index = this.recipients.indexOf(recipient);

    if (index >= 0) {
      this.recipients.splice(index, 1);
    }
  }

  addRecipient(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.recipients.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  createPublisher() {
    if (this.recipients.length) {
      this.dataObj.placement.outboundFtp['alertRecipients'] = this.recipients;
    }
    if (this.dataObj.placement['name']) {
      this.dataObj.placement['value'] = this.dataObj.placement['name']
        .trim()
        .replace(/\./g, '_');
    }

    // console.log(this.dataObj);
    this.loading = true;
    this.error = null;
    this.pubManagementService.addPublisher(this.dataObj).subscribe(
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
}
