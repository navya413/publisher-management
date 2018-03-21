import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UtilService {
  agencies: string[] = [];
  countries: string[];
  industries: string[];
  categories: string[];
  currencies: string[];
  modesOfFile: string[];

  private ftpPublishers$: BehaviorSubject<string[]> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    http
      .get<string[]>(environment.feedsApi + 'placement/values')
      .subscribe((res: string[]) => {
        this.ftpPublishers$.next(res);
      });

    this.loadAgencies();
    this.loadEnums();
  }

  loadAgencies() {
    this.http
      .get<string[]>(environment.adminApi + 'agencies')
      .subscribe((res: string[]) => {
        this.agencies = res;
      });
  }

  loadEnums() {
    this.getEnums('country').subscribe(res => {
      this.countries = res;
    });
    this.getEnums('industry').subscribe(res => {
      this.industries = res;
    });
    this.getEnums('category').subscribe(res => {
      this.categories = res;
    });
    this.getEnums('currency').subscribe(res => {
      this.currencies = res;
    });
    this.getEnums('modeOfFile').subscribe(res => {
      this.modesOfFile = res;
    });
  }

  getEnums(type) {
    return this.http.get<any>(environment.adminApi + 'publishers/enums', {
      params: {
        type: type
      }
    });
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
