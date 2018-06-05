import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCreateMultiComponent } from './teacher-create-multi.component';

describe('TeacherCreateMultiComponent', () => {
  let component: TeacherCreateMultiComponent;
  let fixture: ComponentFixture<TeacherCreateMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherCreateMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherCreateMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
