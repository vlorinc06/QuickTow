import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePanelComp } from './profile-panel-comp';

describe('ProfilePanelComp', () => {
  let component: ProfilePanelComp;
  let fixture: ComponentFixture<ProfilePanelComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePanelComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePanelComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
