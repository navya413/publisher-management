import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PubManagementRoutingModule } from './pub-management-routing.module';
import { PublisherListComponent } from './pub-management.component';
import {
  PublisherDetailsComponent, PublisherSchemaDialog, PublisherInfoDialog,
} from './publisher-details/publisher-details.component';
import { MomentumTableModule } from 'momentum-table';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PubManagementService } from './services/pub-management.service';
import { EditorActionComponent } from './editor-action/editor-action.component';
import { PublisherCreateComponent } from './publisher-create/publisher-create.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MomentumTableModule,
    PubManagementRoutingModule,
    CoreModule
    
  ],
  declarations: [
    PublisherListComponent,
    EditorActionComponent,
    PublisherCreateComponent,
    PublisherDetailsComponent,
    PublisherInfoDialog
  ],
  entryComponents: [PublisherSchemaDialog, PublisherInfoDialog],
  providers: [PubManagementService],
})
export class PubManagementModule {}
