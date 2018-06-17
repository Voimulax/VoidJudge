import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestBasicInfoComponent } from './contest-basic-info/contest-basic-info.component';
import { ContestCreateComponent } from './contest-create/contest-create.component';
import { ContestDetailComponent } from './contest-detail/contest-detail.component';
import { ContestDetailEndedComponent } from './contest-detail/contest-detail-ended/contest-detail-ended.component';
import { ContestDetailInProgressComponent } from './contest-detail/contest-detail-in-progress/contest-detail-in-progress.component';
import { ContestDetailNoStartedComponent } from './contest-detail/contest-detail-no-started/contest-detail-no-started.component';
import { ContestListComponent } from './contest-list/contest-list.component';
import { ContestProgressComponent } from './contest-detail/contest-progress/contest-progress.component';
import { ContestStudentCreateComponent } from './contest-student/contest-student-create/contest-student-create.component';
import { ContestStudentInfoComponent } from './contest-student/contest-student-info/contest-student-info.component';
import { ContestStudentListDialogComponent } from './contest-student/contest-student-list-dialog/contest-student-list-dialog.component';
import { ContestService } from './contest.service';
import { ContestStudentService } from './contest-student/contest-student.service';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  providers: [ContestService, ContestStudentService],
  entryComponents: [ContestStudentListDialogComponent],
  declarations: [
    ContestBasicInfoComponent,
    ContestCreateComponent,
    ContestDetailComponent,
    ContestDetailEndedComponent,
    ContestDetailInProgressComponent,
    ContestDetailNoStartedComponent,
    ContestListComponent,
    ContestProgressComponent,
    ContestStudentCreateComponent,
    ContestStudentInfoComponent,
    ContestStudentListDialogComponent
  ]
})
export class ContestModule {}
