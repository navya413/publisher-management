import { TestBed, inject } from '@angular/core/testing';

import { PubMonitorService } from './pub-monitor.service';

describe('PubMonitorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PubMonitorService]
    });
  });

  it('should be created', inject([PubMonitorService], (service: PubMonitorService) => {
    expect(service).toBeTruthy();
  }));
});
