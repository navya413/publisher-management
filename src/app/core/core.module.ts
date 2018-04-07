import { NgModule } from '@angular/core';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule],
  declarations: [DateRangeComponent, BreadcrumbComponent],
  exports: [DateRangeComponent, BreadcrumbComponent],
})
export class CoreModule {}
