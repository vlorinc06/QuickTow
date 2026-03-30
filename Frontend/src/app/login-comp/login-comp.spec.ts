import { TestBed } from '@angular/core/testing';
import { LoginComp } from './login-comp';
import { Auth } from '../services/auth';
import { AuthService } from '../auth-service';
import { TowUserService } from '../tow-user-service';
import { UserService } from '../user-service';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('LoginComp', () => {
  let component: LoginComp;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComp],
      providers: [
        Auth,         // The API login class
        AuthService,  // The signal state class
        TowUserService,
        UserService,
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});