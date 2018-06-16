import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';

import { ContestService } from '../contest.service';
import { ContestStudentCreateComponent } from '../contest-student/contest-student-create/contest-student-create.component';
import { ContestStudentInfo } from '../contest-student/contest-student.model';
import { FormErrorStateMatcher } from '../../../shared/form-error-state-matcher';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { AddContestResultType } from '../contest.model';

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
    private contestService: ContestService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private router: Router
  ) {
    if (!this.contestService.contestInfo) {
      this.contestService.contestInfo = {
        name: '新考试'
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
    const startTime = new Date(this.contestForm.value.startTime).getTime();
    const endTime = new Date(this.contestForm.value.endTime).getTime();
    if (startTime >= endTime) {
      this.dialogService.showErrorMessage('考试开始时间应早于结束时间');
    } else {
      this.contestService.add(this.contestForm.value).subscribe(r => {
        if (r === AddContestResultType.ok) {
          this.dialogService.showNoticeMessage('创建成功');
          this.reset();
        } else if (r === AddContestResultType.wrong) {
          this.dialogService.showErrorMessage('上传内容有错，创建失败');
        } else {
          this.dialogService.showErrorMessage('网络错误');
        }
      });
    }
  }

  reset() {
    this.studentCreate.reset();
    this.stepper.reset();
  }

  goBack() {
    this.router.navigate([this.url]);
  }
}
