import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { UtilService } from '../../services/util.service';
import { ApiService } from '../../services/api.service';
import { getCurrencySymbol } from '@angular/common';

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.scss']
})
export class AddAgencyComponent implements OnInit {
  selectedAgency;
  currenciesWithSymbol = [{"name":"USD","unicode":"$"},{"name":"EURO","unicode":"€"},{"name":"GBP","unicode":"£"},{"name":"INR","unicode":"₹"},{"name":"CHF","unicode":"CHF"},{"name":"CAD","unicode":"C$"}]
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public utilService : UtilService,
  private apiService : ApiService,
  public dialogRef: MatDialogRef<AddAgencyComponent>) { 
    this.selectedAgency = data.selectedAgency;
  }

  agencyForm : FormGroup;

 ngOnInit() {
    this.initForm()
  }


  initForm(){
    if(this.selectedAgency){
      this.agencyForm = new FormGroup({
        name: new FormControl(this.selectedAgency.name),
        currency :new FormControl(this.selectedAgency.currency.name),
        markup : new FormControl(this.selectedAgency.markup),
        feedPrefix :new FormControl(this.selectedAgency.feedPrefix),
      });  
      return;
    }
    this.agencyForm = new FormGroup({
      name: new FormControl(),
      currency :new FormControl(''),
      markup : new FormControl(''),
      feedPrefix :new FormControl(''),
    });
  }

  updateAgency(){
    let data = {
      id : this.selectedAgency.name,
      update :this.enrichInputData()
    }
    this.apiService.put("api/loki/admin/agency",data).subscribe(resp=>{
      this.dialogRef.close("Updated")
    })
  }


  enrichInputData(){
    let data = this.agencyForm.value

    let currency = this.utilService.currenciesWithSymbol.filter(it=>{
      return it.name === this.agencyForm.value.currency
    })

    data["currency"] = currency[0]
    return data
  }

  addAgency(){
    console.log("Selected agency ....",this.selectedAgency)
    if(this.selectedAgency){
      this.updateAgency();
      return
    }
    this.apiService.post("api/loki/admin/agency",this.enrichInputData()).subscribe(resp=>{
      this.dialogRef.close("Created")
    })
  }
  
  close(){
    this.dialogRef.close()
  }

}
