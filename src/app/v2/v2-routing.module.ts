import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AgenciesComponent } from "./agencies/agencies.component";
import { PublishersComponent } from "./publishers/publishers.component";

const routes: Routes = [
  { path: "", component: HomeComponent,children :[
    { path: "agencies", component: AgenciesComponent },
    { path: "publishers", component: PublishersComponent }
  ] },
  // { path: "agencies", component: AgenciesComponent },
  // { path: "publishers", component: PublishersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class V2RoutingModule {}
