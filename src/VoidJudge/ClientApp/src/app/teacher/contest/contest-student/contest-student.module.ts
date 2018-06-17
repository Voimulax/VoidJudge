import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestStudentCreateComponent } from './contest-student-create/contest-student-create.component';
import { ContestStudentInfoComponent } from './contest-student-info/contest-student-info.component';
import { ContestStudentListDialogComponent } from './contest-student-list-dialog/contest-student-list-dialog.component';
import { ContestStudentService } from './contest-student.service';

import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [ContestStudentCreateComponent, ContestStudentInfoComponent, ContestStudentListDialogComponent],
  providers: [ContestStudentService],
  entryComponents: [ContestStudentListDialogComponent],
  declarations: [ContestStudentCreateComponent, ContestStudentInfoComponent, ContestStudentListDialogComponent]
})
export class ContestStudentModule {}
