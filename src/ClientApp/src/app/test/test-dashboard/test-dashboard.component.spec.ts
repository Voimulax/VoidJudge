
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDashboardComponent } from './test-dashboard.component';

describe('TestDashboardComponent', () => {
  let component: TestDashboardComponent;
  let fixture: ComponentFixture<TestDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
