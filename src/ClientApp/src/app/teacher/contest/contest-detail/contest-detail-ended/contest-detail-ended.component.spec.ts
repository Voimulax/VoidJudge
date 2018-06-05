import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestDetailEndedComponent } from './contest-detail-ended.component';

describe('ContestDetailEndedComponent', () => {
  let component: ContestDetailEndedComponent;
  let fixture: ComponentFixture<ContestDetailEndedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestDetailEndedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestDetailEndedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
