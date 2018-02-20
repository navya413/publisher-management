import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PubFeedsComponent } from './pub-feeds.component';
const routes: Routes = [
  {
    path: '',
    component: PubFeedsComponent,
    data: {
      level: 'root',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PubFeedsRoutingModule {}
