import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PubManagementService {
  constructor(private http: HttpClient) {}

  getPublishers(params) {
    const tempParam = JSON.parse(JSON.stringify(params));

    if(params.agencyId)
      tempParam['agency'] = params.agencyId;
    return this.http.get<any>(environment.adminApi + 'publishers', {
      params: tempParam
    });
  }

  addPublisher(data) {
    return this.http.post<any>(environment.adminApi + 'publishers', data);
  }

  updatePublisher(agency, data) {
    agency = agency === 'All Agencies' ? '' : agency;
    return this.http.put<any>(environment.adminApi + 'publishers',
      data,
      {
        params: {
          agency: agency
        }
      });
  }

  pausePublisher(param, data) {
    return this.http.post<any>(
      environment.adminApi + 'publishers/pause',
      data,
      {
        params: param
      }
    );
  }

  getPublisherSchema(agency, placementId) {
    agency = agency === 'All Agencies' ? '' : agency;
    return this.http.get<any>(
      environment.adminApi + 'publishers/placementSchema',
      {
        params: {
          placementId: placementId,
          agency: agency
        }
      }
    );
  }

  postPublisherSchema(agency, placementId, data) {
    agency = agency === 'All Agencies' ? '' : agency;
    return this.http.post<any>(
      environment.adminApi + 'publishers/placementSchema',
      data,
      {
        params: {
          placementId: placementId,
          agency: agency
        }
      }
    );
  }

  getAgenciesForPublisher(publisherId) {
    return this.http.get<any>(`${environment.adminApi}publishers/`);
  }

  updatePublisherAgencies(publisher, agencies) {
    return this.http.post<any>(
      `${environment.adminApi}publishers/updateAgency`,
      agencies,
      {
        params: {
          publisher
        }
      }
    );
  }
}
