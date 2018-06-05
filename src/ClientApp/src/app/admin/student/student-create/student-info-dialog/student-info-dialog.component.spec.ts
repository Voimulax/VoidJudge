import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInfoDialogComponent } from './student-info-dialog.component';

describe('StudentInfoDialogComponent', () => {
  let component: StudentInfoDialogComponent;
  let fixture: ComponentFixture<StudentInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
