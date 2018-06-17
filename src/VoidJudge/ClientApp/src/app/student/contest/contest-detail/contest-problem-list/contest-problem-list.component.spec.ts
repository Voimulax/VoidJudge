import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestProblemListComponent } from './contest-problem-list.component';

describe('ContestProblemListComponent', () => {
  let component: ContestProblemListComponent;
  let fixture: ComponentFixture<ContestProblemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestProblemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestProblemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
