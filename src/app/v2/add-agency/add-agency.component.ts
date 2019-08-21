import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.scss']
})
export class AddAgencyComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddAgencyComponent>) { }

  agencyForm : FormGroup;

  ngOnInit() {
    this.initForm()
  }

  initForm(){
    this.agencyForm = new FormGroup({
      name: new FormControl('')
    });
  }

  addAgency(){

  }
  
  close(){
    this.dialogRef.close()
  }

}
