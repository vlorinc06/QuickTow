import { TestBed } from '@angular/core/testing';
import { UserService } from './user-service';
import { AuthService } from './auth-service';
import { TowUserService } from './tow-user-service';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: { user: { set: () => {} } } }, 
        { provide: TowUserService, useValue: { updateTowUser: () => ({ subscribe: () => {} }) } }, 
        provideHttpClient() 
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
