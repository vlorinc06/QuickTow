import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { ViewRatingsWindow } from './view-ratings-window';
import { TowUserService } from '../tow-user-service';
import { RatingService } from '../rating-service';

describe('ViewRatingsWindow', () => {
  let component: ViewRatingsWindow;
  let fixture: ComponentFixture<ViewRatingsWindow>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const mockRatings = [
    {
      id: 1,
      rating: 5,
      text: 'Excellent service',
      date: '2026-03-30',
      tow_request: 1,
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
        status: 'available',
      },
    },
  ];

  const towUserServiceMock = {
    selectedTowUser: {
      set: vi.fn(),
    },
    getTowUserById: vi.fn().mockReturnValue(
      of({
        id: 2,
        first_name: 'Tow',
        last_name: 'Driver',
        username: 'towdriver',
        email: 'tow@example.com',
        phone_number: '987654321',
        price_per_km: 100,
        status: 'available',
      })
    ),
  };

  const ratingServiceMock = {
    getRatingsByTowUser: vi.fn().mockReturnValue(of(mockRatings)),
    getRatingsByUser: vi.fn().mockReturnValue(of(mockRatings)),
    addRating: vi.fn().mockReturnValue(of(mockRatings[0])),
    deleteRating: vi.fn().mockReturnValue(of(mockRatings[0])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRatingsWindow],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: TowUserService, useValue: towUserServiceMock },
        { provide: RatingService, useValue: ratingServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewRatingsWindow);
    component = fixture.componentInstance;

    (component as any).towUserId = 2;
    (component as any).towUserFirstName = 'Tow';
    (component as any).towUserLastName = 'Driver';
    (component as any).towUserUsername = 'towdriver';

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