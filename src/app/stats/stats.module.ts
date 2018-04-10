import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsRoutingModule } from './stats-routing.module';
import { ClientsStatsComponent } from './clients-stats/clients-stats.component';
import { StatsComponent } from './stats.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { StatsService } from './services/stats.service';
import { MomentumTableModule } from 'momentum-table';
import { StatsTableComponent } from './stats-table/stats-table.component';
import { StatsPopupComponent } from './stats-popup/stats-popup.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    StatsRoutingModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    MomentumTableModule,
    CoreModule,
  ],
  providers: [StatsService],
  declarations: [
    ClientsStatsComponent,
    StatsComponent,
    StatsTableComponent,
    StatsPopupComponent,
  ],
  entryComponents: [StatsPopupComponent],
})
export class StatsModule {}
