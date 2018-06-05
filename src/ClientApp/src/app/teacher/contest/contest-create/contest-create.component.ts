import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';

import { AuthService } from '../../../core/auth/auth.service';
import { ContestService } from '../contest.service';
import { ContestStudentCreateComponent } from '../contest-student/contest-student-create/contest-student-create.component';
import { ContestStudentInfo } from '../contest-student/contest-student.model';
import { FormErrorStateMatcher } from '../../../shared/form-error-state-matcher';

@Component({
  selector: 'app-contest-create',
  templateUrl: './contest-create.component.html',
  styleUrls: ['./contest-create.component.css']
})
export class ContestCreateComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('studentCreate') studentCreate: ContestStudentCreateComponent;
  studentList: ContestStudentInfo[];
  contestForm: FormGroup;
  matcher = new FormErrorStateMatcher();

  private url = '/teacher/contest';

  constructor(
    private authService: AuthService,
    private contestService: ContestService,
    private fb: FormBuilder,
    private router: Router
  ) {
    if (!this.contestService.contestInfo) {
      this.contestService.contestInfo = {
        name: '新考试',
        teacherId: this.authService.user.id
      };
    }
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.contestForm = this.fb.group({
      name: new FormControl(this.contestService.contestInfo.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)
      ]),
      startTime: new FormControl(undefined, [Validators.required]),
      endTime: new FormControl(undefined, [Validators.required]),
      notice: new FormControl('')
    });
  }

  create() {
    this.contestService.contestInfo.name = this.contestForm.get('name').value;
    this.contestService.contestInfo.startTime = moment(this.contestForm.get('startTime').value).valueOf();
    this.contestService.contestInfo.endTime = moment(this.contestForm.get('endTime').value).valueOf();
    this.contestService.contestInfo.notice = this.contestForm.get('notice').value;
    console.log(this.contestService.contestInfo);
  }

  reset() {
    this.studentCreate.reset();
    this.stepper.reset();
  }

  goBack() {
    this.router.navigate([this.url]);
  }
}
