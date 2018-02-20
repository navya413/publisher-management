import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class UtilService {
  private agencies$: BehaviorSubject<string[]> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    http.get<string[]>('http://localhost:11001/admin/api/agencies')
      .subscribe((res: string[]) => {
        console.log(res);
        this.agencies$.next(res);
      });

  }

  getAgencies(): Observable<string[]> {
    return this.agencies$;
  }

}
