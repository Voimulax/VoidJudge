import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestStudentInfoComponent } from './contest-student-info.component';

describe('ContestStudentInfoComponent', () => {
  let component: ContestStudentInfoComponent;
  let fixture: ComponentFixture<ContestStudentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestStudentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestStudentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
