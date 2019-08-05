import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { RouteDataService } from './services/route-data.service';
import { SimpleNotificationsModule} from 'angular2-notifications';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './home/token.interceptor';
import { UtilService } from './services/util.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule,
    SimpleNotificationsModule.forRoot(),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  },RouteDataService,UtilService],
  bootstrap: [AppComponent],
})
export class AppModule {}
