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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    V2RoutingModule,
    CoreModule
  ],
  declarations: [HomeComponent,HeaderComponent, AgenciesComponent, PublishersComponent, AgencyViewComponent, PublisherViewComponent],
  providers : [ApiService]
})
export class V2Module { }
