import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PubMonitorComponent } from './pub-monitor.component';
import { PubMonitorRoutingModule } from './pub-monitor-routing.module';
import { EntityNavComponent } from '../entity-nav/entity-nav.component';
import { MaterialModule } from '../material/material.module';
import { MomentumTableModule } from 'momentum-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  PublisherDetailDialogComponent,
  PublishersComponent,
} from './publishers/publishers.component';
import { PubMonitorService } from './services/pub-monitor.service';
import { AmChartsModule } from '@amcharts/amcharts3-angular';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MomentumTableModule,
    AmChartsModule,
    PubMonitorRoutingModule,
    CoreModule,
  ],
  declarations: [
    PubMonitorComponent,
    EntityNavComponent,
    PublishersComponent,
    PublisherDetailDialogComponent,
  ],
  providers: [PubMonitorService],
  entryComponents: [PublisherDetailDialogComponent],
})
export class PubMonitorModule {}
