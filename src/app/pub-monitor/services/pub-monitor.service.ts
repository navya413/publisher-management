import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PubMonitorService {
  constructor(private http: HttpClient) {}

  getClientHierarchy(agencyId) {
    return this.http.get<any>('http://localhost:11001/admin/api/clients', {
      params: {
        agencyId: agencyId,
      },
    });
  }

  getPublishersStats(params) {
    const tempParam = JSON.parse(JSON.stringify(params));
    let url = (tempParam.clientId) ? 'http://localhost:11001/admin/api/stats' : 'http://localhost:11001/admin/api/agencyLevelStats';
    return this.http
      .get<any>(url, {
        params: tempParam,
      });
  }

}
