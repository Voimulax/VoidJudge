import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestProblemCreateComponent } from './contest-problem-create.component';

describe('ContestProblemCreateComponent', () => {
  let component: ContestProblemCreateComponent;
  let fixture: ComponentFixture<ContestProblemCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestProblemCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestProblemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
