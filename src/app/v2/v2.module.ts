import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { V2RoutingModule } from './v2-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { CoreModule } from '../core/core.module';
import { AgenciesComponent } from './agencies/agencies.component';
import { PublishersComponent } from './publishers/publishers.component';
import { ApiService } from '../services/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgencyViewComponent } from './agency-view/agency-view.component';
import { PublisherViewComponent } from './publisher-view/publisher-view.component';
import { AssignEntityComponent } from './assign-entity/assign-entity.component';
import { PublisherStatsComponent } from './publisher-stats/publisher-stats.component';
import { AgencySetupComponent } from './agency-setup/agency-setup.component';
import { ViewContactsComponent } from './view-contacts/view-contacts.component';
import { AddAgencyComponent } from './add-agency/add-agency.component';
import { V2Service } from './v2.service';
import { BillingComponent } from './billing/billing.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    V2RoutingModule,
    CoreModule
  ],
  entryComponents : [AssignEntityComponent,ViewContactsComponent,AddAgencyComponent],
  declarations: [HomeComponent,HeaderComponent, AgenciesComponent, PublishersComponent, AgencyViewComponent, PublisherViewComponent, AssignEntityComponent, PublisherStatsComponent, AgencySetupComponent,ViewContactsComponent, AddAgencyComponent, BillingComponent],
  providers : [ApiService,V2Service]
})
export class V2Module { }
