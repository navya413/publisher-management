import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-stats-popup',
  templateUrl: './stats-popup.component.html',
  styleUrls: ['./stats-popup.component.scss']
})
export class StatsPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<StatsPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
