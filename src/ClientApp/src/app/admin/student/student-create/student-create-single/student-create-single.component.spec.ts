import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCreateSingleComponent } from './student-create-single.component';

describe('StudentCreateSingleComponent', () => {
  let component: StudentCreateSingleComponent;
  let fixture: ComponentFixture<StudentCreateSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCreateSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCreateSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
