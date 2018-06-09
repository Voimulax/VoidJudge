import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';

import { AuthGuard } from './core/auth/auth.guard';
import { UserType } from './core/auth/user.model';
import { TestGuard } from './test/test.guard';

const routes: Routes = [
  {
    path: 'student',
    loadChildren: './student/student.module#StudentModule',
    canLoad: [AuthGuard],
    data: { userType: UserType.student }
  },
  {
    path: 'teacher',
    loadChildren: './teacher/teacher.module#TeacherModule',
    canLoad: [AuthGuard],
    data: { userType: UserType.teacher }
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canLoad: [AuthGuard],
    data: { userType: UserType.admin }
  },
  {
    path: 'test',
    loadChildren: './test/test.module#TestModule',
    canLoad: [TestGuard]
  },
  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
    data: { userType: undefined }
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
