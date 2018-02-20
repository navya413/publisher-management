import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class PubManagementService {

  constructor(private http: HttpClient) { }

  getPublishers(params) {
    let tempParam = JSON.parse(JSON.stringify(params));
    tempParam['agency'] = params.agencyId || '';
    return this.http.get<any>('http://localhost:11001/admin/api/publishers', {
      params: tempParam
    });
  }

  addPublisher(data) {
    return this.http.post<any>('http://localhost:11001/admin/api/publishers', data);
  }

  updatePublisher(data) {
    return this.http.put<any>('http://localhost:11001/admin/api/publishers', data);
  }

}
