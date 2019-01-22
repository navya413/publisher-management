import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DaterangepickerComponent } from './daterangepicker.component';
import { DaterangepickerDirective } from './daterangepicker.directive';

@NgModule({
  declarations: [DaterangepickerComponent, DaterangepickerDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [],
  exports: [DaterangepickerComponent, DaterangepickerDirective],
  entryComponents: [DaterangepickerComponent]
})
export class NgxDaterangepickerMd {}
