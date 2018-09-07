import { TestBed, inject } from '@angular/core/testing';

import { TellerService } from './teller.service';

describe('TellerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TellerService]
    });
  });

  it('should be created', inject([TellerService], (service: TellerService) => {
    expect(service).toBeTruthy();
  }));
});
