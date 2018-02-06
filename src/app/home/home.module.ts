import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {HeaderComponent} from '../header/header.component';
import {EditPublisherDialog, PublishersComponent} from '../publishers/publishers.component';
import {HomeRoutingModule} from './home-routing.module';
import {RouterModule} from '@angular/router';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule,
  MatTabsModule
} from "@angular/material";
import {MomentumTableModule} from "momentum-table";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {TokenInterceptor} from "../auth/token.interceptor";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MomentumTableModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    HeaderComponent,
    PublishersComponent,
    EditPublisherDialog
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  entryComponents: [EditPublisherDialog]
})
export class HomeModule { }
