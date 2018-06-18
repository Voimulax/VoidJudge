import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestSubmissionStateDialogComponent } from './contest-submission-state-dialog.component';

describe('ContestSubmissionStateDialogComponent', () => {
  let component: ContestSubmissionStateDialogComponent;
  let fixture: ComponentFixture<ContestSubmissionStateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestSubmissionStateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestSubmissionStateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
