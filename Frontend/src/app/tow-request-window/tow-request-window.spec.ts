import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowRequestWindow } from './tow-request-window';

describe('TowRequestWindow', () => {
  let component: TowRequestWindow;
  let fixture: ComponentFixture<TowRequestWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowRequestWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowRequestWindow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
