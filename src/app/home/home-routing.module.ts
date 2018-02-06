import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {PublishersComponent} from '../publishers/publishers.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'publisher', pathMatch: 'full' },
      {
        path: 'publisher',
        component: PublishersComponent
      },
      {
        path: 'publisher2',
        component: PublishersComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
