import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComp } from './login-comp';

describe('LoginComp', () => {
  let component: LoginComp;
  let fixture: ComponentFixture<LoginComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
