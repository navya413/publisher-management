import { NgModule } from '@angular/core';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import {ChartViewComponent} from "./components/chart-view/chart-view.component";
import {AmChartsModule} from "@amcharts/amcharts3-angular";
import {FormsModule} from "@angular/forms";
import {EmptyViewComponent} from "./components/empty-view/empty-view.component";

@NgModule({
  imports: [CommonModule, FormsModule, MaterialModule, RouterModule, AmChartsModule],
  declarations: [DateRangeComponent, BreadcrumbComponent, ChartViewComponent, EmptyViewComponent],
  exports: [DateRangeComponent, BreadcrumbComponent, ChartViewComponent, EmptyViewComponent],
})
export class CoreModule {}
