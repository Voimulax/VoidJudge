import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';

import { AuthGuard } from './core/auth/auth.guard';
import { RoleType } from './core/auth/user.model';
import { TestGuard } from './test/test.guard';

const routes: Routes = [
  {
    path: 'student',
    loadChildren: './student/student.module#StudentModule',
    canLoad: [AuthGuard],
    data: { roleType: RoleType.student }
  },
  {
    path: 'teacher',
    loadChildren: './teacher/teacher.module#TeacherModule',
    canLoad: [AuthGuard],
    data: { roleType: RoleType.teacher }
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canLoad: [AuthGuard],
    data: { roleType: RoleType.admin }
  },
  {
    path: 'test',
    loadChildren: './test/test.module#TestModule',
    canLoad: [TestGuard]
  },
  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
    data: { roleType: undefined }
  },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: !environment.production
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
