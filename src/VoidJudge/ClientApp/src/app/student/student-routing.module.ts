import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/auth/auth.guard';
import { ContestDetailComponent } from './contest/contest-detail/contest-detail.component';
import { ContestListComponent } from './contest/contest-list/contest-list.component';
import { SettingsComponent } from './settings/settings.component';
import { StudentComponent } from './student/student.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'contest', pathMatch: 'full' },
      { path: 'contest', component: ContestListComponent },
      { path: 'contest/:id', component: ContestDetailComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}
