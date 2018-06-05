import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestStudentCreateComponent } from './contest-student-create.component';

describe('ContestStudentCreateComponent', () => {
  let component: ContestStudentCreateComponent;
  let fixture: ComponentFixture<ContestStudentCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestStudentCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestStudentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
