import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PubManagementRoutingModule } from './pub-management-routing.module';
import { PubManagementComponent } from './pub-management.component';
import {
  PublisherDialog, PublisherEditDiolog, PublisherInfoDiolog,
  PublisherListComponent,
} from './publisher-list/publisher-list.component';
import { MomentumTableModule } from 'momentum-table';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PubManagementService } from './services/pub-management.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MomentumTableModule,
    PubManagementRoutingModule,
  ],
  declarations: [
    PubManagementComponent,
    PublisherListComponent,
    PublisherDialog,
    PublisherInfoDiolog,
    PublisherEditDiolog
  ],
  entryComponents: [PublisherDialog, PublisherInfoDiolog, PublisherEditDiolog],
  providers: [PubManagementService],
})
export class PubManagementModule {}
