import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UtilService {
  private agencies$: BehaviorSubject<string[]> = new BehaviorSubject(null);
  private ftpPublishers$: BehaviorSubject<string[]> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    http
      .get<string[]>(environment.adminApi + 'agencies')
      .subscribe((res: string[]) => {
        this.agencies$.next(res);
      });

    http
      .get<string[]>(environment.feedsApi + 'placement/values')
      .subscribe((res: string[]) => {
        this.ftpPublishers$.next(res);
      });
  }

  getAgencies(): Observable<string[]> {
    return this.agencies$;
  }

  getFtpPublishersList() {
    return this.ftpPublishers$;
  }
}
