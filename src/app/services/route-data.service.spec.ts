import { TestBed, inject } from '@angular/core/testing';

import { RouteDataService } from './route-data.service';

describe('RouteDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteDataService]
    });
  });

  it('should be created', inject([RouteDataService], (service: RouteDataService) => {
    expect(service).toBeTruthy();
  }));
});
