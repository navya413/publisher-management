import { TestBed, inject } from '@angular/core/testing';

import { PubManagementService } from './pub-management.service';

describe('PubManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PubManagementService]
    });
  });

  it('should be created', inject([PubManagementService], (service: PubManagementService) => {
    expect(service).toBeTruthy();
  }));
});
