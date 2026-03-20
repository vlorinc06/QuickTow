import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowMapPage } from './tow-map-page';

describe('TowMapPage', () => {
  let component: TowMapPage;
  let fixture: ComponentFixture<TowMapPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowMapPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowMapPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
