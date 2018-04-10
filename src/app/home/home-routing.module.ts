import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'publisher-stats', pathMatch: 'full' },
      {
        path: 'publisher-monitor',
        loadChildren: '../pub-monitor/pub-monitor.module#PubMonitorModule'
      },
      {
        path: 'publisher-management',
        loadChildren: '../pub-management/pub-management.module#PubManagementModule'
      },
      {
        path: 'publisher-feeds',
        loadChildren: '../pub-feeds/pub-feeds.module#PubFeedsModule'
      },
      {
        path: 'publisher-stats',
        loadChildren: '../stats/stats.module#StatsModule'
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
