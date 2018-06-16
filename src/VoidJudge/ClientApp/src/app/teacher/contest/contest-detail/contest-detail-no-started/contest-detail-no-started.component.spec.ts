import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestDetailNoStartedComponent } from './contest-detail-no-started.component';

describe('ContestDetailNoStartedComponent', () => {
  let component: ContestDetailNoStartedComponent;
  let fixture: ComponentFixture<ContestDetailNoStartedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestDetailNoStartedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestDetailNoStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
