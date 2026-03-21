import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRatingsWindow } from './view-ratings-window';

describe('ViewRatingsWindow', () => {
  let component: ViewRatingsWindow;
  let fixture: ComponentFixture<ViewRatingsWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRatingsWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRatingsWindow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
