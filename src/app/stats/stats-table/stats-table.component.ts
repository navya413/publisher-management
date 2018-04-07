import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-stats-table',
  templateUrl: './stats-table.component.html',
  styleUrls: ['./stats-table.component.scss'],
})
export class StatsTableComponent implements OnInit {
  @Input() value;
  @Input() title;
  @Input() loading;
  @Input() showHeader = true;
  constructor(public utilService: UtilService, public dialog: MatDialog) {}

  ngOnInit() {}

  onRowClick = function(row) {
    // const dialogRef = this.dialog.open(StatsPopupComponent, {
    //   width: '80vw',
    //   height: '80vh',
    //   data: {
    //     value: this.value
    //   }
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    // });
  };
}
