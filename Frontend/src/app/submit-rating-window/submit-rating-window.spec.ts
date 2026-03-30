import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubmitRatingWindow } from './submit-rating-window';

describe('SubmitRatingWindow', () => {
  let component: SubmitRatingWindow;
  let fixture: ComponentFixture<SubmitRatingWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitRatingWindow],
      providers: [
      { provide: MatDialogRef, useValue: { close: () => {} } }, 
      { provide: MAT_DIALOG_DATA, useValue: {} } 
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitRatingWindow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
