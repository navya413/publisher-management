import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { NewEntity } from '../../model/new-entity-state';

@Injectable()
export class StatsService {
  clientMap: object = {};
  timezones: any[];
  timezoneId: string;
  dateRange = {
    days: 'Today',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  };

  constructor(private http: HttpClient) {
    this.getTimeZones().subscribe(res => {
      this.timezones = res;
    });
  }

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
    const params = {
      since: this.dateRange.startDate,
      till: this.dateRange.endDate
    };
    if (this.timezoneId) {
      params['tz'] = this.timezoneId;
    }
    return this.http.get<NewEntity[]>(
      url,
      {
        params: params
      },
    );
  }

  getDailyStats(routeData, entityId) {
    const agencyId = routeData.params.agencyId;
    const level = routeData.data.level;
    let url = environment.newStatsApi + 'agency/' + agencyId + '/';
    if (!routeData.params.entityId) {
      url += level + '/' + entityId + '/days';
    } else {
      url += level + '/' + routeData.params.entityId + '/' + routeData.data.subLevel + '/' + entityId + '/days';
    }
    const params = {
      since: this.dateRange.startDate,
      till: this.dateRange.endDate
    };
    if (this.timezoneId) {
      params['tz'] = this.timezoneId;
    }
    return this.http.get<NewEntity[]>(
      url,
      {
        params: params
      },
    );
  }

  getTimeZones() {
    return this.http.get<any>('./assets/mock-data/timezone-data.json');
  }
}
