import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PubFeedsComponent } from './pub-feeds.component';
import { FtpManagementComponent } from './ftp-management/ftp-management.component';
import { FtpAlertsComponent } from './ftp-alerts/ftp-alerts.component';
import {ReconciliationComponent} from './reconciliation/reconciliation.component';
const routes: Routes = [
  {
    path: '',
    component: PubFeedsComponent,
    children: [
      { path: '', redirectTo: 'ftp-management', pathMatch: 'full' },
      {
        path: 'ftp-management',
        component: FtpManagementComponent,
      },
      {
        path: 'ftp-alerts',
        component: FtpAlertsComponent,
      },
      {
        path: 'reconciliation',
        component: ReconciliationComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PubFeedsRoutingModule {}
