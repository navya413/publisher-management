import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(private http : HttpClient) { }

  get(url, params?: any): any {
    return this.http.get(url, { params: params });
  }

}
