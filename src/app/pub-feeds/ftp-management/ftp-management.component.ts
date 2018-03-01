import {Component, Inject, OnInit} from '@angular/core';
import { PubFeedsService } from '../services/pub-feeds.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-ftp-management',
  templateUrl: './ftp-management.component.html',
  styleUrls: ['./ftp-management.component.scss'],
})
export class FtpManagementComponent implements OnInit {
  loading: boolean;
  placements = [];
  constructor(private pubFeedsService: PubFeedsService, public dialog: MatDialog,) {}

  ngOnInit() {
    this.loading = true;
    this.pubFeedsService.getFtpPublishers().subscribe((res: any) => {
      console.log(res);
      this.loading = false;
      this.placements = res;
    });
  }

  getFolderPath(row, col) {
    const folderObj = row[col.field]['folderpath'];
    const arr = [];
    Object.keys(folderObj).forEach(key => {
      arr.push(folderObj[key]);
    });
    return arr;
  }

  openDetailDialog(row) {
    const dialogRef = this.dialog.open(DetailDialog, {
      width: '600px',
      data: row,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        console.log(result);
      }
    });
  }

  onRowClick(row) {
    this.openDetailDialog(row.data);
  }

}


@Component({
  selector: 'detail-dialog',
  templateUrl: 'detail-dialog.html',
  styles: ['.table-key {padding-right: 2rem; font-weight: bold;}']
})
export class DetailDialog {
  constructor(
    public dialogRef: MatDialogRef<DetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
