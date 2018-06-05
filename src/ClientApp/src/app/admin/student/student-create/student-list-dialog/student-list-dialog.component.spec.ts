import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentListDialogComponent } from './student-list-dialog.component';

describe('StudentListDialogComponent', () => {
  let component: StudentListDialogComponent;
  let fixture: ComponentFixture<StudentListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
