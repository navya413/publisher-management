import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {NewEntity, NewEntityTwo} from "../../model/new-entity-state";
import * as moment from "moment";

@Injectable()
export class PubMonitorService {
  entityMap: object = {};
  timezones: any[];
  timezoneId: string;
  statsView = 'all';
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

  getStats(routeData, projection, app = 'mojo') {
    const params = {
      since: this.dateRange.startDate,
      till: this.dateRange.endDate,
      agencyIds: routeData.params.agencyId,
      clientIds: routeData.params.clientId,
      campaignIds: routeData.params.campaignId,
      page: 1,
      limit: 10000
    };
    if (this.timezoneId) {
      params['tz'] = this.timezoneId;
    }
    return this.http.get<NewEntityTwo[]>(
      'http://107.23.111.183:8080/gandalf/app/' + app + '/metrics/' + projection + '/by/' + routeData.data.entity,
      {
        params: JSON.parse(JSON.stringify(params))
      },
    );
  }

  getTimeZones() {
    return this.http.get<any>('./assets/mock-data/timezone-data.json');
  }

  flattenEntityTree(clientTree) {
    this.entityMap = {};
    const tree = JSON.parse(JSON.stringify(clientTree));
    tree.forEach(client => {
      this.entityMap[client.id] = client.name;
      if (client.children && client.children.length) {
        client.children.forEach(campaign => {
          this.entityMap[campaign.id] = campaign.name;
          if (campaign.children && campaign.children.length) {
            campaign.children.forEach(jobgroup => {
              this.entityMap[jobgroup.id] = jobgroup.name;
            });
          }
        });
      }
    });
  }
}
