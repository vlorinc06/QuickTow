import { TestBed } from '@angular/core/testing';

import { TowUserService } from './tow-user-service';

describe('TowUserService', () => {
  let service: TowUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TowUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
