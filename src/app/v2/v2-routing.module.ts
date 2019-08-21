import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AgenciesComponent } from "./agencies/agencies.component";
import { PublishersComponent } from "./publishers/publishers.component";
import { AgencyViewComponent } from "./agency-view/agency-view.component";
import { PublisherViewComponent } from "./publisher-view/publisher-view.component";
import { AgencySetupComponent } from "./agency-setup/agency-setup.component";
import { PublisherStatsComponent } from "./publisher-stats/publisher-stats.component";
import { BillingComponent } from "./billing/billing.component";

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
        path: "agency/:agencyId/publishers",
        component: AgencyViewComponent
      },
      {
        path: "agency/:agencyId/settings",
        component: AgencyViewComponent
      },
      {
        path: "agency/:entityId/stats",
        component: PublisherStatsComponent,
        data : {
          "routeType" : "agency"
        }
      },
      {
        path: "agency/:agencyId/billing",
        component: BillingComponent
      },
      { path: "publishers", component: PublishersComponent },
      { path: "publisher/:publisherId/agencies", component: AgencySetupComponent },
      {
        path: "publisher/:entityId/stats",
        component: PublisherStatsComponent,
        data : {
          "routeType" : "publisher"
        }
      },
      { path: "publisher/:publisherId/view", component: PublisherViewComponent },
      { path: "publisher/:publisherId/settings", component: AgencySetupComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class V2RoutingModule {}
