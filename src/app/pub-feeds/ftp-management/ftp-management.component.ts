import { Component, Inject, OnInit } from '@angular/core';
import { PubFeedsService } from '../services/pub-feeds.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ftp-management',
  templateUrl: './ftp-management.component.html',
  styleUrls: ['./ftp-management.component.scss'],
})
export class FtpManagementComponent implements OnInit {
  loading: boolean;
  placements = [];
  constructor(
    private pubFeedsService: PubFeedsService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getFtpPublishers();
  }

  getFtpPublishers() {
    this.placements = [];
    this.loading = true;
    this.pubFeedsService.getFtpPublishers().subscribe(
      (res: any) => {
        this.loading = false;
        this.placements = res.data.records;
        console.log(res);
      },
      err => {
        this.loading = false;
      },
    );
  }

  getFolderPath(row, col) {
    const folderObj = row['placement']['ftpConfig']['folderpath'];
    const arr = [];
    Object.keys(folderObj).forEach(key => {
      arr.push(folderObj[key]);
    });
    return arr;
  }

  openDetailDialog(row) {
    this.dialog.open(DetailDialog, {
      width: '600px',
      data: row,
    });
  }

  onRowClick(row) {
    this.openDetailDialog(row.data);
  }

  onReload() {
    this.getFtpPublishers();
  }
}

@Component({
  selector: 'detail-dialog',
  templateUrl: 'detail-dialog.html',
  styles: ['.table-key {padding-right: 2rem; font-weight: bold;}'],
})
export class DetailDialog {
  constructor(
    public dialogRef: MatDialogRef<DetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data);
  }
}
