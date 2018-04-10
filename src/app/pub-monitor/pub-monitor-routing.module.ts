import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PubMonitorComponent } from './pub-monitor.component';
import { PublishersComponent } from './publishers/publishers.component';
import { EmptyViewComponent } from '../core/components/empty-view/empty-view.component';
const routes: Routes = [
  {
    path: '',
    component: PubMonitorComponent,
    data: {
      level: 'root',
    },
    children: [
      {
        path: '',
        component: EmptyViewComponent,
        data: {
          level: 'agency',
        },
      },
      {
        path: 'agency/:agencyId',
        component: PublishersComponent,
        data: {
          level: 'agency',
        },
      },
      {
        path: 'agency/:agencyId/client/:clientId',
        component: PublishersComponent,
        data: {
          level: 'client',
        },
      },
      {
        path: 'agency/:agencyId/client/:clientId/campaign/:campaignId',
        component: PublishersComponent,
        data: {
          level: 'campaign',
        },
      },
      {
        path:
          'agency/:agencyId/client/:clientId/campaign/:campaignId/jobgroup/:jobgroupId',
        component: PublishersComponent,
        data: {
          level: 'jobgroup',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PubMonitorRoutingModule {}
