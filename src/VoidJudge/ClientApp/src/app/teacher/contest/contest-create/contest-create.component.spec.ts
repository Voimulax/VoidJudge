import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestCreateComponent } from './contest-create.component';

describe('ContestNewComponent', () => {
  let component: ContestCreateComponent;
  let fixture: ComponentFixture<ContestCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
