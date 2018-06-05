import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCreateMultiComponent } from './student-create-multi.component';

describe('StudentCreateMultiComponent', () => {
  let component: StudentCreateMultiComponent;
  let fixture: ComponentFixture<StudentCreateMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCreateMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCreateMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
