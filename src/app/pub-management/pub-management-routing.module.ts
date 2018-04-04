import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PublisherListComponent } from './pub-management.component';
const routes: Routes = [
  {
    path: '',
    component: PublisherListComponent,
    data: {
      level: 'root',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PubManagementRoutingModule {}
