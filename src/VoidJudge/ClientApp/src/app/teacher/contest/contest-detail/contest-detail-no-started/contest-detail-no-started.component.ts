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

import { AuthService } from '../../../../core/auth/auth.service';
import { ContestService } from '../../contest.service';
import { ContestStudentCreateComponent } from '../../contest-student/contest-student-create/contest-student-create.component';
import { FormErrorStateMatcher } from '../../../../shared/form-error-state-matcher';

@Component({
  selector: 'app-contest-detail-no-started',
  templateUrl: './contest-detail-no-started.component.html',
  styleUrls: ['./contest-detail-no-started.component.css']
})
export class ContestDetailNoStartedComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('studentCreate') studentCreate: ContestStudentCreateComponent;
  contestForm: FormGroup;
  matcher = new FormErrorStateMatcher();

  get contestInfo() {
    return this.contestService.contestInfo;
  }

  private url = '/teacher/contest';

  constructor(
    private contestService: ContestService,
    private fb: FormBuilder,
    private router: Router
  ) {
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
      startTime: new FormControl(
        moment(this.contestService.contestInfo.startTime),
        [Validators.required]
      ),
      endTime: new FormControl(
        moment(this.contestService.contestInfo.endTime),
        [Validators.required]
      ),
      notice: new FormControl(this.contestService.contestInfo.notice)
    });
  }

  publish(flag: boolean) {}

  save() {
    this.contestService.contestInfo.name = this.contestForm.get('name').value;
    this.contestService.contestInfo.startTime = moment(this.contestForm.get('startTime').value).valueOf();
    this.contestService.contestInfo.endTime = moment(this.contestForm.get('endTime').value).valueOf();
    this.contestService.contestInfo.notice = this.contestForm.get('notice').value;
    console.log(this.contestService.contestInfo);
  }

  delete() {}

  reset() {
    this.studentCreate.reset();
    this.stepper.reset();
  }

  goBack() {
    this.router.navigate([this.url]);
  }
}
