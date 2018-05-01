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
        path: 'agency/:agencyId/clients',
        component: PublishersComponent,
        data: {
          level: 'agency',
          entity: 'clients'
        },
      },
      {
        path: 'agency/:agencyId/campaigns',
        component: PublishersComponent,
        data: {
          level: 'agency',
          entity: 'campaigns'
        },
      },
      {
        path: 'agency/:agencyId/jobgroups',
        component: PublishersComponent,
        data: {
          level: 'agency',
          entity: 'jobGroups'
        },
      },
      {
        path: 'agency/:agencyId/publishers',
        component: PublishersComponent,
        data: {
          level: 'agency',
          entity: 'publishers'
        },
      },
      {
        path: 'agency/:agencyId/client/:clientId/campaigns',
        component: PublishersComponent,
        data: {
          level: 'client',
          entity: 'campaigns'
        },
      },
      {
        path: 'agency/:agencyId/client/:clientId/jobgroups',
        component: PublishersComponent,
        data: {
          level: 'client',
          entity: 'jobGroups'
        },
      },
      {
        path: 'agency/:agencyId/client/:clientId/publishers',
        component: PublishersComponent,
        data: {
          level: 'client',
          entity: 'publishers'
        },
      },
      {
        path: 'agency/:agencyId/client/:clientId/campaign/:campaignId/jobgroups',
        component: PublishersComponent,
        data: {
          level: 'campaign',
          entity: 'jobGroups'
        },
      },
      {
        path: 'agency/:agencyId/client/:clientId/campaign/:campaignId/publishers',
        component: PublishersComponent,
        data: {
          level: 'campaign',
          entity: 'publishers'
        },
      },
      {
        path:
          'agency/:agencyId/client/:clientId/campaign/:campaignId/jobgroup/:jobgroupId/publishers',
        component: PublishersComponent,
        data: {
          level: 'jobgroup',
          entity: 'publishers'
        },
      },
      {
        path: 'agency/:agencyId/publishers',
        component: PublishersComponent,
        data: {
          level: 'agency',
          entity: 'publishers'
        },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PubMonitorRoutingModule {}
