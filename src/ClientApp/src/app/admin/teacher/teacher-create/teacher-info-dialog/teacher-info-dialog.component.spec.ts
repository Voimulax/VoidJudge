import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherInfoDialogComponent } from './teacher-info-dialog.component';

describe('TeacherInfoDialogComponent', () => {
  let component: TeacherInfoDialogComponent;
  let fixture: ComponentFixture<TeacherInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
