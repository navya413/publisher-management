import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PubManagementComponent } from './pub-management.component';
const routes: Routes = [
  {
    path: '',
    component: PubManagementComponent,
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
