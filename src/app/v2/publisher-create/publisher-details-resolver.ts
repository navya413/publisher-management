import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Injectable } from "@angular/core";
import { PubManagementService} from "../../pub-management/services/pub-management.service"
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PublisherDetailsResolver implements Resolve<any> {
  constructor(public pubManagementService: PubManagementService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.pubManagementService.getPublisherV2(route.params.agencyId || '',route.params.publisherId);
  }
}

@Injectable()
export class PublisherClientsResolver implements Resolve<any> {
  constructor(public pubManagementService: PubManagementService) { }
  
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.pubManagementService.getAgencyClients(route.params.agencyId);
  }
}