import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestTableComponent } from './test-table/test-table.component';
import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule
} from '@angular/material';
import { TestDashboardComponent } from './test-dashboard/test-dashboard.component';
import { TestNavComponent } from './test-nav/test-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { TestGuard } from './test.guard';
import { TestComponent } from './test/test.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    TestRoutingModule,
  ],
  providers: [TestGuard],
  declarations: [TestTableComponent, TestDashboardComponent, TestNavComponent, TestComponent]
})
export class TestModule {}
