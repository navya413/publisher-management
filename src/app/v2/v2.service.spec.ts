import { TestBed, inject } from '@angular/core/testing';

import { V2Service } from './v2.service';

describe('V2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [V2Service]
    });
  });

  it('should be created', inject([V2Service], (service: V2Service) => {
    expect(service).toBeTruthy();
  }));
});
