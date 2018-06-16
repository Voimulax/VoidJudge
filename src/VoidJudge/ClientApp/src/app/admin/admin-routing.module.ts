import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { ContestListComponent } from './contest/contest-list/contest-list.component';
import { SettingsComponent } from './settings/settings.component';
import { StudentCreateComponent } from './student/student-create/student-create.component';
import { StudentListComponent } from './student/student-list/student-list.component';
import { StudentDetailComponent } from './student/student-detail/student-detail.component';
import { TeacherCreateComponent } from './teacher/teacher-create/teacher-create.component';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';
import { TeacherDetailComponent } from './teacher/teacher-detail/teacher-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'contest', pathMatch: 'full' },
      { path: 'contest', component: ContestListComponent },
      { path: 'student', component: StudentListComponent },
      { path: 'student/create', component: StudentCreateComponent },
      { path: 'student/:id', component: StudentDetailComponent },
      { path: 'teacher', component: TeacherListComponent },
      { path: 'teacher/create', component: TeacherCreateComponent },
      { path: 'teacher/:id', component: TeacherDetailComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
