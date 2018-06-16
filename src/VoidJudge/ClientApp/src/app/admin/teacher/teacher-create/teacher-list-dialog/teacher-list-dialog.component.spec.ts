import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherListDialogComponent } from './teacher-list-dialog.component';

describe('TeacherListDialogComponent', () => {
  let component: TeacherListDialogComponent;
  let fixture: ComponentFixture<TeacherListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
