import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestModule } from './contest/contest.module';
import { SettingsComponent } from './settings/settings.component';
import { StudentComponent } from './student/student.component';
import { StudentRoutingModule } from './student-routing.module';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, StudentRoutingModule, SharedModule, ContestModule],
  declarations: [StudentComponent, SettingsComponent]
})
export class StudentModule {}
