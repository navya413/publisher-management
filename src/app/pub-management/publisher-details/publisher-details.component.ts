import { Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatChipInputEvent,
  MatDialog,
  MatDialogRef
} from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UtilService } from '../../services/util.service';
import { PubManagementService } from './../services/pub-management.service';
import { EntityState, INITIAL_ENTITY_STATE } from '../../model/entity-state';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { NotificationsService } from 'angular2-notifications';
import { DataTable } from 'momentum-table';
import {
  PUB_EDIT_OPTIONS,
  Item
} from '../../model/entity';
import { Publisher } from '../../model/publisher';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-publisher-details',
  templateUrl: './publisher-details.component.html',
  styleUrls: ['./publisher-details.component.scss']
})
export class PublisherDetailsComponent implements OnInit {
  typeAheadController: FormControl;
  loading: boolean;
  publisherResp: any;
  publishers: Object[] = [];
  params: EntityState;

  selectedAgency = 'All Agencies';

  selectedPublishers = [];

  public typeAhead = [];
  filteredOptions: Observable<any[]>;

  updating: boolean;
  updateError: string;
  @ViewChild(DataTable) table: DataTable;

  editOptions: Item[] = PUB_EDIT_OPTIONS;

  public interval;

  constructor(
    private pubManagementService: PubManagementService,
    public dialog: MatDialog,
    private utilService: UtilService,
    private notifService: NotificationsService,
    private router: Router,
    public route: ActivatedRoute    
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

  editPublisher(editType) {
    const editData =  {
      publisher: this.selectedPublishers[0],
      selectedAgency: this.selectedAgency
    }
    this.pubManagementService.setPublisherData(editData);
    this.router.navigate(['../edit'], {relativeTo: this.route});
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
}

// Publisher Schema Mapping Dialog
@Component({
selector: 'publisher-schema-dialog',
templateUrl: '../dialogs/publisher-schema-dialog.html',
styleUrls: ['../dialogs/publisher-schema-dialog.scss']
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
    .getPublisherSchema(this.data.selectedAgency, this.data.publisher.placement.id || this.data.publisher.id)
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
  templateUrl: '../dialogs/publisher-info-dialog.html',
  styleUrls: ['../dialogs/publisher-info-dialog.scss']
})
export class PublisherInfoDialog {
  constructor(
    public dialogRef: MatDialogRef<PublisherInfoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}

