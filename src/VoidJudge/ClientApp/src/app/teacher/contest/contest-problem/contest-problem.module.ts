import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestProblemComponent } from './contest-problem/contest-problem.component';
import { ContestProblemCreateComponent } from './contest-problem-create/contest-problem-create.component';
import { ContestProblemListComponent } from './contest-problem-list/contest-problem-list.component';
import { ContestProblemService } from './contest-problem.service';

import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [ContestProblemComponent, ContestProblemCreateComponent, ContestProblemListComponent],
  providers: [ContestProblemService],
  declarations: [ContestProblemComponent, ContestProblemCreateComponent, ContestProblemListComponent]
})
export class ContestProblemModule {}
