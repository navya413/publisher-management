import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";

@Injectable()
export class PubMonitorService {
  constructor(private http: HttpClient) {}

  getClientHierarchy(agencyId) {
    return this.http.get<any>(environment.adminApi + 'clients', {
      params: {
        agencyId: agencyId,
      },
    });
  }

  getPublishersStats(params) {
    const tempParam = JSON.parse(JSON.stringify(params));
    const url = (tempParam.clientId) ? environment.adminApi + 'stats' : environment.adminApi + 'agencyLevelStats';
    return this.http
      .get<any>(url, {
        params: tempParam,
      });
  }

  getPublisherChartData() {
    const tempParam = {
      agencyId: 'bayard',
      placementId: 'Indeed',
      freq: 'DAILY',
      period: 'Last month'
    }
    const url = environment.adminApi + 'statsPerPeriod';
    return this.http
      .get<any>(url, {
        params: tempParam,
      });
  }
}
