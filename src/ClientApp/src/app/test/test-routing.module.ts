import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestDashboardComponent } from './test-dashboard/test-dashboard.component';
import { TestNavComponent } from './test-nav/test-nav.component';
import { TestTableComponent } from './test-table/test-table.component';
import { TestGuard } from './test.guard';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  {
    path: '',
    component: TestComponent,
    canActivate: [TestGuard],
    children: [
      {
        path: 'dashboard',
        component: TestDashboardComponent
      },
      {
        path: 'nav',
        component: TestNavComponent
      },
      {
        path: 'table',
        component: TestTableComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule {}
