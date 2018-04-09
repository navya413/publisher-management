import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientsStatsComponent } from './clients-stats/clients-stats.component';
import { StatsComponent } from './stats.component';
import {EmptyViewComponent} from "../core/components/empty-view/empty-view.component";
const routes: Routes = [
  {
    path: '',
    component: StatsComponent,
    children: [
      {
        path: 'agency/:agencyId',
        component: ClientsStatsComponent,
        data: {
          level: 'agency',
        }
      },
      {
        path: 'agency/:agencyId/clients',
        component: ClientsStatsComponent,
        data: {
          level: 'clients',
        }
      },
      {
        path: 'agency/:agencyId/clients/:entityId',
        component: ClientsStatsComponent,
        data: {
          level: 'clients',
          subLevel: 'publishers'
        }
      },
      {
        path: 'agency/:agencyId/publishers',
        component: ClientsStatsComponent,
        data: {
          level: 'publishers',
        }
      },
      {
        path: 'agency/:agencyId/publishers/:entityId',
        component: ClientsStatsComponent,
        data: {
          level: 'publishers',
          subLevel: 'clients'
        }
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsRoutingModule {}
