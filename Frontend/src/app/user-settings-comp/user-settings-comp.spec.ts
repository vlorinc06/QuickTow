import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsComp } from './user-settings-comp';

describe('UserSettingsComp', () => {
  let component: UserSettingsComp;
  let fixture: ComponentFixture<UserSettingsComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSettingsComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSettingsComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
