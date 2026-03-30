import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth-service';
import { UserService } from '../user-service';
import { TowUserService } from '../tow-user-service';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        UserService,
        TowUserService,
        provideHttpClient() 
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});