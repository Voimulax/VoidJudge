
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTableComponent } from './test-table.component';

describe('TestTableComponent', () => {
  let component: TestTableComponent;
  let fixture: ComponentFixture<TestTableComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
