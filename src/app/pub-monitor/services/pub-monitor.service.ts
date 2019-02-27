import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {NewEntity, NewEntityTwo} from "../../model/new-entity-state";
import * as moment from "moment";
import {THIS_MONTH} from '../../date-range/presets.util';

@Injectable()
export class PubMonitorService {
  entityMap: object = {};
  timezones: any[];
  timezoneId: string;
  statsView = 'all';
  dateRange = {
    startDate: THIS_MONTH.range[0].format('YYYY-MM-DD'),
    endDate: THIS_MONTH.range[1].format('YYYY-MM-DD')
  };

  publisherDetails = [];

  constructor(private http: HttpClient) {
    this.getTimeZones().subscribe(res => {
      this.timezones = res;
    });
    this.getPublisherDetails().subscribe(res => {
      if (res && res.data) {
        this.publisherDetails = res.data.data;
      }
    });
  }

  getPublisherDetails() {
    return this.http.get<any>(
      `${environment.authApi}placements/publisherFilters`
    );
  }

  setDate(dateRange?) {
    this.dateRange.startDate = dateRange
      ? dateRange.startDate
      : THIS_MONTH.range[0].format('YYYY-MM-DD');
    this.dateRange.endDate = dateRange
      ? dateRange.endDate
      : THIS_MONTH.range[1].format('YYYY-MM-DD');
  }

  getClientHierarchy(agencyId) {
    return this.http.get<any>(environment.adminApi + 'clients', {
      params: {
        agencyId: agencyId,
      },
    });
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
      environment.newStatsApi + app + '/metrics/' + projection + '/by/' + routeData.data.entity,
      {
        params: JSON.parse(JSON.stringify(params))
      },
    );
  }

  getPublisherNameDetails(pub) {
    const publisherNamedetails = this.publisherDetails.find(item => {
      return item.value === pub;
    });
    return publisherNamedetails && publisherNamedetails['name'];
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
