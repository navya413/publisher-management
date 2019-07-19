import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AgenciesComponent } from "./agencies/agencies.component";
import { PublishersComponent } from "./publishers/publishers.component";
import { AgencyViewComponent } from "./agency-view/agency-view.component";
import { PublisherViewComponent } from "./publisher-view/publisher-view.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "agencies",
        component: AgenciesComponent
      },
      {
        path: "agency/:agencyId/view",
        component: AgencyViewComponent
      },
      { path: "publishers", component: PublishersComponent },
      { path: "publisher/:publisherId/view", component: PublisherViewComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class V2RoutingModule {}
