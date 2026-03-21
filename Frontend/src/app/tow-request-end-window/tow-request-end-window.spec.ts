import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowRequestEndWindow } from './tow-request-end-window';

describe('TowRequestEndWindow', () => {
  let component: TowRequestEndWindow;
  let fixture: ComponentFixture<TowRequestEndWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowRequestEndWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowRequestEndWindow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
