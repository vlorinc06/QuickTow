import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TowRequestWindow } from './tow-request-window';
import { AuthService } from '../auth-service';
import { TowRequestService } from '../tow-request-service';
import { TowUserService } from '../tow-user-service';
import { UserService } from '../user-service';

describe('TowRequestWindow', () => {
  let component: TowRequestWindow;
  let fixture: ComponentFixture<TowRequestWindow>;

  const authServiceMock = {
    currentUser: signal({
      id: 1,
      type: 'user',
      username: 'testuser',
    }),
    isLoggedIn: signal(true),
    isTowUser: signal(false),
    isRegularUser: signal(true),
  };

  const towRequestServiceMock = {
    createTowRequest: vi.fn().mockReturnValue(of({})),
    getTowRequestsByUser: vi.fn().mockReturnValue(of([])),
    updateTowRequest: vi.fn().mockReturnValue(of({})),
  };

  const towUserServiceMock = {
    selectedTowUser: signal<number | null>(1),
    getTowUserById: vi.fn().mockReturnValue(
      of({
        id: 1,
        price_per_km: 100,
      })
    ),
  };

  const userServiceMock = {
    user: signal({
      id: 1,
      first_name: 'Test',
      last_name: 'User',
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowRequestWindow],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TowRequestService, useValue: towRequestServiceMock },
        { provide: TowUserService, useValue: towUserServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TowRequestWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});