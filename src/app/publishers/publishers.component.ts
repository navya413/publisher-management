import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublishersComponent implements OnInit {

  publishers: Object[] = [];

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit() {
    this.http.get<any>('http://localhost:11001/api/publisher').subscribe(
      (res: any) => {
        this.publishers = res.data;
      }
    );
  }

  onEditPublisher(row) {
    const dialogRef = this.dialog.open(EditPublisherDialog, {
      width: '500px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

}

@Component({
  selector: 'edit-publisher-dialog',
  templateUrl: 'edit-publisher-dialog.html',
})
export class EditPublisherDialog {

  constructor(
    public dialogRef: MatDialogRef<EditPublisherDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
