import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestProgressComponent } from './contest-progress.component';

describe('ContestProgressComponent', () => {
  let component: ContestProgressComponent;
  let fixture: ComponentFixture<ContestProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
