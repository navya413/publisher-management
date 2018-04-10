import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PubFeedsService {
  constructor(private http: HttpClient) {}

  getFtpPublishers() {
    return this.http.get<any>(environment.adminApi + 'publishers', {
      params: {
        page: '1',
        limit: '1000',
        ftp: 'true',
      },
    });
  }

  getFtpPublishersList() {
    return this.http.get<any>(environment.feedsApi + 'placement/values');
  }

  getPublisherAlerts(publisher) {
    return this.http.get<any>(environment.feedsApi + 'alert/' + publisher);
  }
}
