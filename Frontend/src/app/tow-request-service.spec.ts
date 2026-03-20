import { TestBed } from '@angular/core/testing';

import { TowRequestService } from './tow-request-service';

describe('TowRequestService', () => {
  let service: TowRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TowRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
