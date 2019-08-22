import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PublisherListComponent } from './pub-management.component';
import { PublisherCreateComponent } from './publisher-create/publisher-create.component';
import { PublisherDetailsComponent } from './publisher-details/publisher-details.component';

const routes: Routes = [
  {
    path: '',
    component: PublisherListComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'details', 
        pathMatch: 'full'
       },
      {
        path: 'details',
        component: PublisherDetailsComponent
      },
      {
        path: 'create',
        component: PublisherCreateComponent,
      },
      {
        path: 'edit',
        component: PublisherCreateComponent,
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PubManagementRoutingModule {}
