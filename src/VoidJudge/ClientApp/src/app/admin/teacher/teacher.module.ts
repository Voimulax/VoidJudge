import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { TeacherCreateComponent } from './teacher-create/teacher-create.component';
import { TeacherCreateMultiComponent } from './teacher-create/teacher-create-multi/teacher-create-multi.component';
import { TeacherCreateSingleComponent } from './teacher-create/teacher-create-single/teacher-create-single.component';
import { TeacherDetailComponent } from './teacher-detail/teacher-detail.component';
import { TeacherInfoDialogComponent } from './teacher-create/teacher-info-dialog/teacher-info-dialog.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { TeacherListDialogComponent } from './teacher-create/teacher-list-dialog/teacher-list-dialog.component';
import { TeacherService } from './teacher.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  providers: [TeacherService],
  entryComponents: [TeacherInfoDialogComponent, TeacherListDialogComponent],
  declarations: [
    TeacherCreateComponent,
    TeacherCreateMultiComponent,
    TeacherCreateSingleComponent,
    TeacherDetailComponent,
    TeacherInfoDialogComponent,
    TeacherListComponent,
    TeacherListDialogComponent
  ]
})
export class TeacherModule {}
