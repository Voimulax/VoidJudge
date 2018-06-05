import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCreateSingleComponent } from './teacher-create-single.component';

describe('TeacherCreateSingleComponent', () => {
  let component: TeacherCreateSingleComponent;
  let fixture: ComponentFixture<TeacherCreateSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherCreateSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherCreateSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
