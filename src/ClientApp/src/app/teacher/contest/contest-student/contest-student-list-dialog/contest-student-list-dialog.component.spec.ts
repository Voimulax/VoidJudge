import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestStudentListDialogComponent } from './contest-student-list-dialog.component';

describe('ContestStudentListDialogComponent', () => {
  let component: ContestStudentListDialogComponent;
  let fixture: ComponentFixture<ContestStudentListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestStudentListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestStudentListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
