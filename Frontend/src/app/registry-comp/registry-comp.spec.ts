import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryComp } from './registry-comp';

describe('RegistryComp', () => {
  let component: RegistryComp;
  let fixture: ComponentFixture<RegistryComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistryComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
