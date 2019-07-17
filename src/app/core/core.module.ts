import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { ChartViewComponent } from './components/chart-view/chart-view.component';
import { AmChartsModule } from '@amcharts/amcharts3-angular';
import { FormsModule } from '@angular/forms';
import { EmptyViewComponent } from './components/empty-view/empty-view.component';
import { DateRangeComponent } from '../date-range/date-range.component';
import { NgxDaterangepickerMd } from '../daterangepicker/daterangepicker.module';
import {DateRangeOldComponent} from './components/date-range/date-range.component';
import { MomentumTableModule } from 'momentum-table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    AmChartsModule,
    NgxDaterangepickerMd,
    MomentumTableModule
  ],
  declarations: [
    DateRangeComponent,
    DateRangeOldComponent,
    BreadcrumbComponent,
    ChartViewComponent,
    EmptyViewComponent
  ],
  exports: [
    DateRangeComponent,
    DateRangeOldComponent,
    BreadcrumbComponent,
    ChartViewComponent,
    EmptyViewComponent,
    MaterialModule,
    MomentumTableModule
  ],
})
export class CoreModule {}
