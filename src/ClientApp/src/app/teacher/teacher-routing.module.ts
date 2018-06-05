import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/auth/auth.guard';
import { ContestCreateComponent } from './contest/contest-create/contest-create.component';
import { ContestListComponent } from './contest/contest-list/contest-list.component';
import { ContestDetailComponent } from './contest/contest-detail/contest-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { TeacherComponent } from './teacher/teacher.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'contest', pathMatch: 'full' },
      { path: 'contest', component: ContestListComponent },
      { path: 'contest/create', component: ContestCreateComponent },
      { path: 'contest/:id', component: ContestDetailComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {}
