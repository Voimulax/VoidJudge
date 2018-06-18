import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestStudentCreateComponent } from './contest-student-create/contest-student-create.component';
import { ContestStudentInfoComponent } from './contest-student-info/contest-student-info.component';
import { ContestStudentListDialogComponent } from './contest-student-list-dialog/contest-student-list-dialog.component';
import { ContestStudentService } from './contest-student.service';
import { ContestSubmissionStateDialogComponent } from './contest-submission-state-dialog/contest-submission-state-dialog.component';

import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [ContestStudentCreateComponent, ContestStudentInfoComponent, ContestStudentListDialogComponent],
  providers: [ContestStudentService],
  entryComponents: [ContestStudentListDialogComponent, ContestSubmissionStateDialogComponent],
  declarations: [
    ContestStudentCreateComponent,
    ContestStudentInfoComponent,
    ContestStudentListDialogComponent,
    ContestSubmissionStateDialogComponent
  ]
})
export class ContestStudentModule {}
