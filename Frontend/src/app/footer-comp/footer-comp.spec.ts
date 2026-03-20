import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComp } from './footer-comp';

describe('FooterComp', () => {
  let component: FooterComp;
  let fixture: ComponentFixture<FooterComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
