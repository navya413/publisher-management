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
import { PublisherCreateComponent } from "./publisher-create/publisher-create.component";
import { PublisherDetailsResolver, PublisherClientsResolver } from "./publisher-create/publisher-details-resolver"

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
        path: "agency/:agencyId/publisher/:publisherId/edit", 
        component: PublisherCreateComponent,
        data: {
          "routeType" : "agency",
        },
        resolve: {
          data: PublisherDetailsResolver,
          clients: PublisherClientsResolver
        }
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
        path: "agency/:entityId/billing",
        component: BillingComponent ,
        data : {
          "routeType" : "agency",
          "screen" : "billing",
          "selectedView" : "Billing"
        }
      },
      {
        path: "agency/:entityId/clicks",
        component: BillingComponent ,
        data : {
          "routeType" : "agency",
          "screen" : "clicks",
          "selectedView" : "Clicks"
        }
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
      {
        path: "publisher/:entityId/billing",
        component: BillingComponent,
        data : {
          "routeType" : "publisher",
          "screen" : "billing",
          "selectedView" : "Billing"
        }
      }, 
      {
        path: "publisher/:entityId/clicks",
        component: BillingComponent,
        data : {
          "routeType" : "publisher",
          "screen" : "clicks",
          "selectedView" : "Clicks"
        }
      },
      { path: "publisher/:publisherId/view", component: PublisherViewComponent },
      { path: "publisher/:publisherId/settings", component: AgencySetupComponent },
      { path: "publisher/create",
        component: PublisherCreateComponent
      },
      { path: "publisher/:publisherId/edit", 
        component: PublisherCreateComponent,
        resolve: {
          data: PublisherDetailsResolver
        }
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class V2RoutingModule {}
