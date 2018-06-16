import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestBasicInfoComponent } from './contest-basic-info.component';

describe('ContestBasicInfoComponent', () => {
  let component: ContestBasicInfoComponent;
  let fixture: ComponentFixture<ContestBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
