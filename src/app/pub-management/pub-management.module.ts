import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PubManagementRoutingModule } from './pub-management-routing.module';
import {
  PublisherAddDialog,
  PublisherEditDialog,
  PublisherInfoDialog,
  PublisherListComponent,
} from './pub-management.component';
import { MomentumTableModule } from 'momentum-table';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PubManagementService } from './services/pub-management.service';
import { EditorActionComponent } from './editor-action/editor-action.component';

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
    PublisherListComponent,
    PublisherAddDialog,
    PublisherInfoDialog,
    PublisherEditDialog,
    EditorActionComponent
  ],
  entryComponents: [PublisherAddDialog, PublisherInfoDialog, PublisherEditDialog],
  providers: [PubManagementService],
})
export class PubManagementModule {}
