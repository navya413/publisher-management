import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PubMonitorService {
  selectedDay = 'This month';
  startDate;
  endDate;
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
    tempParam.days = this.selectedDay;
    tempParam.startDate = this.startDate;
    tempParam.endDate = this.endDate;
    const url = tempParam.clientId
      ? environment.adminApi + 'clients-stats'
      : environment.adminApi + 'agencyLevelStats';
    return this.http.get<any>(url, {
      params: tempParam,
    });
  }

  getPublisherChartData(params) {
    const url = environment.adminApi + 'statsPerPeriod';
    return this.http.get<any>(url, {
      params: params,
    });
  }

  setSelectedDay(value) {
    this.selectedDay = value.days;
    this.startDate = value.startDate;
    this.endDate = value.endDate;
  }
}
