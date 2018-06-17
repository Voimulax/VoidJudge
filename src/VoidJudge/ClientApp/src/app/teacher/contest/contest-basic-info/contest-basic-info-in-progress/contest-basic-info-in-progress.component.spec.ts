import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestBasicInfoInProgressComponent } from './contest-basic-info-in-progress.component';

describe('ContestBasicInfoInProgressComponent', () => {
  let component: ContestBasicInfoInProgressComponent;
  let fixture: ComponentFixture<ContestBasicInfoInProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestBasicInfoInProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestBasicInfoInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
