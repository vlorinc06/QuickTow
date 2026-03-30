import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { TowRequestEndWindow } from './tow-request-end-window';
import { TowRequestService } from '../tow-request-service';

describe('TowRequestEndWindow', () => {
  let component: TowRequestEndWindow;
  let fixture: ComponentFixture<TowRequestEndWindow>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dialogMock = {
    open: vi.fn().mockReturnValue({
      componentInstance: {},
    }),
  };

  const mockRequest = {
    id: 1,
    status: 'in progress',
    user_confirmed: 0,
    tow_user_confirmed: 0,

    user: {
      id: 1,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      email: 'test@example.com',
      phone_number: '123456789',
    },

    tow_user: {
      id: 2,
      first_name: 'Tow',
      last_name: 'Driver',
      username: 'towdriver',
      email: 'tow@example.com',
      phone_number: '987654321',
      price_per_km: 100,
    },

    pickup_lat: 47.4979,
    pickup_long: 19.0402,
    dropoff_lat: 47.5,
    dropoff_long: 19.05,
    issue_description: 'Flat tire',
    total_price: 5000,
  };

  const towRequestServiceMock = {
    getTowRequestById: vi.fn().mockReturnValue(of(mockRequest)),
    updateTowRequest: vi.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowRequestEndWindow],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: TowRequestService, useValue: towRequestServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TowRequestEndWindow);
    component = fixture.componentInstance;

    component.request = { ...mockRequest } as any;
    component.isTowUser = false;

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});