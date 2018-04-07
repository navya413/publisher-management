import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable()
export class StatsService {

  clientTree: any[];
  dateRange = {
    days: 'Today',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  };

  constructor(private http: HttpClient) {}

  getClientHierarchy(agencyId) {
    return this.http.get<any>(environment.adminApi + 'clients', {
      params: {
        agencyId: agencyId,
      },
    });
  }
  getStats(routeData) {
    const agencyId = routeData.params.agencyId;
    const level = routeData.data.level;
    let url = environment.newStatsApi + 'agency/' + agencyId + '/' + level;
    if (routeData.params.entityId) {
      url += '/' + routeData.params.entityId + '/' + routeData.data.subLevel;
    }
    return this.http.get<any>(
      url,
      {
        params: {
          since: this.dateRange.startDate,
          till: this.dateRange.endDate,
        },
      },
    );
  }
}
