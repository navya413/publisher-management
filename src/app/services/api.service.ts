import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(private http : HttpClient) { }

  get(url, params?: any): any {
    return this.http.get(url, { params: params });
  }

  post(url, data?: any): any {
    return this.http.post(url, data);
  }


  put(url, data?: any): any {
    return this.http.put(url, data);
  }



}
