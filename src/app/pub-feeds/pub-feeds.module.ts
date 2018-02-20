import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PubFeedsComponent } from './pub-feeds.component';
import { PubFeedsRoutingModule } from './pub-feeds-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { FtpManagementComponent } from './ftp-management/ftp-management.component';
import { FtpAlertsComponent } from './ftp-alerts/ftp-alerts.component';
import { PubFeedsService } from './services/pub-feeds.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MomentumTableModule} from "momentum-table";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PubFeedsRoutingModule,
    MaterialModule,
    MomentumTableModule,
    RouterModule,
  ],
  declarations: [PubFeedsComponent, FtpManagementComponent, FtpAlertsComponent],
  providers: [PubFeedsService],
})
export class PubFeedsModule {}
