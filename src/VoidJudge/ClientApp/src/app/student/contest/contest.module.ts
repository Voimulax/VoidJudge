import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestDetailComponent } from './contest-detail/contest-detail.component';
import { ContestListComponent } from './contest-list/contest-list.component';
import { ContestProblemListComponent } from './contest-detail/contest-problem-list/contest-problem-list.component';
import { ContestService } from './contest.service';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  providers: [ContestService],
  declarations: [ContestListComponent, ContestDetailComponent, ContestProblemListComponent]
})
export class ContestModule {}
