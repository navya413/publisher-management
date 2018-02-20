import { TestBed, inject } from '@angular/core/testing';

import { PubFeedsService } from './pub-feeds.service';

describe('PubFeedsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PubFeedsService]
    });
  });

  it('should be created', inject([PubFeedsService], (service: PubFeedsService) => {
    expect(service).toBeTruthy();
  }));
});
