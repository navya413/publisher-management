import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {UtilService} from '../services/util.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public inj: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const auth = this.inj.get(AuthService);
     if (request.url.indexOf('slack') === -1) {
       request = request.clone({
         setHeaders: {
           'MojoAccessToken': auth.getToken() || null
         }
       });
     }

    return next.handle(request).do(event => {
      if (event instanceof HttpResponse) {
        const utilService = this.inj.get(UtilService);
        if (request.url.split('/').pop() === 'publishers' && location.hostname.indexOf('prod') !== -1) {
          utilService.logSlack(request);
        }
      }
    });
  }
}
