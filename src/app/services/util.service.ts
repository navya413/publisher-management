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


  isEmpty(obj) {
    return !Object.keys(obj).length;
  }

  objectCleaner(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && typeof(obj[key]) === 'object') {
        this.objectCleaner(obj[key]);
        if (this.isEmpty(obj[key])) {
          delete obj[key];
        }
      }
      if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
        delete obj[key];
      }
    });
  }
}
