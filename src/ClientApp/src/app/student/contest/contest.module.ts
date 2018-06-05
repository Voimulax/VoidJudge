import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestDetailComponent } from './contest-detail/contest-detail.component';
import { ContestListComponent } from './contest-list/contest-list.component';
import { ContestSubmissionComponent } from './contest-detail/contest-submission/contest-submission.component';
import { ContestService } from './contest.service';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  providers: [ContestService],
  declarations: [ContestListComponent, ContestDetailComponent, ContestSubmissionComponent]
})
export class ContestModule {}
