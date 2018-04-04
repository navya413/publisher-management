import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PubManagementService {
  constructor(private http: HttpClient) {}

  getPublishers(params) {
    let tempParam = JSON.parse(JSON.stringify(params));
    tempParam['agency'] = params.agencyId || '';
    return this.http.get<any>(environment.adminApi + 'publishers', {
      params: tempParam,
    });
  }

  addPublisher(data) {
    return this.http.post<any>(environment.adminApi + 'publishers', data);
  }

  updatePublisher(data) {
    return this.http.put<any>(environment.adminApi + 'publishers', data);
  }

  pausePublisher(param, data) {
    return this.http.post<any>(environment.adminApi + 'publishers/pause', data, {
      params: param
    });
  }
}
