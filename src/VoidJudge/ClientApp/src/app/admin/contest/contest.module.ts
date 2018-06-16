import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestListComponent } from './contest-list/contest-list.component';
import { ContestService } from './contest.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ContestListComponent],
  providers: [ContestService]
})
export class ContestModule {}
