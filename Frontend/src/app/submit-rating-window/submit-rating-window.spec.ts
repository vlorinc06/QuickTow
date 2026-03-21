import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitRatingWindow } from './submit-rating-window';

describe('SubmitRatingWindow', () => {
  let component: SubmitRatingWindow;
  let fixture: ComponentFixture<SubmitRatingWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitRatingWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitRatingWindow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
