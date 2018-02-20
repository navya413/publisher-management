import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PubFeedsService {
  constructor(private http: HttpClient) {}

  getFtpPublishers() {
    return this.http.get<any>('http://172.31.22.241:8001/placement');
  }

  getFtpPublishersTypeahead() {
    return this.http.get<any>('http://172.31.22.241:8001/placement/values');
  }

  getPublisherAlerts(publisher) {
    return this.http.get<any>('http://172.31.22.241:8001/alert/' + publisher);
  }
}
