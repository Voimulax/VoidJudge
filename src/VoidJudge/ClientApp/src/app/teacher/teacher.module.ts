import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestModule } from './contest/contest.module';
import { TeacherComponent } from './teacher/teacher.component';
import { TeacherRoutingModule } from './teacher-routing.module';

import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [CommonModule, TeacherRoutingModule, SharedModule, ContestModule],
  declarations: [TeacherComponent, SettingsComponent]
})
export class TeacherModule {}
