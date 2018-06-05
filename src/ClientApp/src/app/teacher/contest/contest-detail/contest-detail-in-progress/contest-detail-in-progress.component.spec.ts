import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestDetailInProgressComponent } from './contest-detail-in-progress.component';

describe('ContestDetailInProgressComponent', () => {
  let component: ContestDetailInProgressComponent;
  let fixture: ComponentFixture<ContestDetailInProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestDetailInProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestDetailInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
