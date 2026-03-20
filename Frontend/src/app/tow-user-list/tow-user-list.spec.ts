import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowUserList } from './tow-user-list';

describe('TowUserList', () => {
  let component: TowUserList;
  let fixture: ComponentFixture<TowUserList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowUserList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowUserList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
