import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper, MatSlideToggle, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';

import { ContestService } from '../../contest.service';
import { ContestStudentCreateComponent } from '../../contest-student/contest-student-create/contest-student-create.component';
import { FormErrorStateMatcher } from '../../../../shared/form-error-state-matcher';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { PutContestResultType, ContestState, ContestInfo, DeleteContestResultType } from '../../contest.model';
import { AddContestStudentResultType, ContestStudentListDialogData } from '../../contest-student/contest-student.model';
import { ContestStudentListDialogComponent } from '../../contest-student/contest-student-list-dialog/contest-student-list-dialog.component';

@Component({
  selector: 'app-contest-detail-no-started',
  templateUrl: './contest-detail-no-started.component.html',
  styleUrls: ['./contest-detail-no-started.component.css']
})
export class ContestDetailNoStartedComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('studentCreate') studentCreate: ContestStudentCreateComponent;
  @ViewChild('publishSlideToggle') publishSlideToggle: MatSlideToggle;
  contestForm: FormGroup;
  matcher = new FormErrorStateMatcher();

  private lastState: ContestState;

  get contestInfo() {
    return this.contestService.contestInfo;
  }

  private url = '/teacher/contest';

  constructor(
    private contestService: ContestService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.contestForm = this.fb.group({
      name: new FormControl(this.contestInfo.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)
      ]),
      startTime: new FormControl(moment(this.contestInfo.startTime), [Validators.required]),
      endTime: new FormControl(moment(this.contestInfo.endTime), [Validators.required]),
      notice: new FormControl(this.contestInfo.notice)
    });
  }

  save(isPublish: boolean = false) {
    const contestInfo: ContestInfo = this.contestForm.value;
    contestInfo.id = this.contestInfo.id;
    contestInfo.state = this.contestInfo.state;

    const startTime = new Date(contestInfo.startTime).getTime();
    const endTime = new Date(contestInfo.endTime).getTime();
    if (startTime >= endTime) {
      this.contestService.contestInfo.state = this.lastState;
      this.lastState = undefined;
      this.dialogService.showErrorMessage('考试开始时间应早于结束时间');
    } else {
      this.publish(this.publishSlideToggle.checked);
      contestInfo.state = this.contestInfo.state;

      this.contestService.put(contestInfo).subscribe(r => {
        if (r === PutContestResultType.ok) {
          this.studentCreate.create().subscribe(scr => {
            if (scr.type === AddContestStudentResultType.ok) {
              this.dialogService.showNoticeMessage(`${isPublish ? '发布' : '保存'}成功`);
            } else if (scr.type === AddContestStudentResultType.studentsNotFound) {
              const nfIds = new Set(scr['notFoundList'].map(x => x.studentId));
              const data: ContestStudentListDialogData = {
                notFoundList: this.contestInfo.students.filter(x => nfIds.has(x.studentId))
              };
              this.dialogService.showErrorMessage(`${isPublish ? '发布' : '保存'}成功，但上传学生失败`, () => {
                const dialog = this.dialog.open(ContestStudentListDialogComponent, { data: data });
              });
            } else {
              this.dialogService.showErrorMessage(`${isPublish ? '发布' : '保存'}成功，但上传学生失败`);
            }
          });
        } else {
          if (this.lastState !== undefined) {
            this.contestService.contestInfo.state = this.lastState;
            this.lastState = undefined;
          }
          if (r === PutContestResultType.unauthorized) {
            this.dialogService.showErrorMessage('无权修改该考试的信息');
          } else if (r === PutContestResultType.concurrencyException) {
            this.dialogService.showErrorMessage('修改时出现同步问题，暂时无法进行修改');
          } else if (r === PutContestResultType.contestNotFound) {
            this.dialogService.showErrorMessage('该考试不存在');
          } else if (r === PutContestResultType.wrong) {
            this.dialogService.showErrorMessage('提交内容有误');
          } else {
            this.dialogService.showErrorMessage('网络错误');
          }
        }
      });
    }
  }

  publish(flag: boolean) {
    const date = new Date().getTime();
    if (date >= this.contestForm.value['startTime'] || date >= this.contestForm.value['endTime']) {
      this.dialogService.showErrorMessage('请确保考试时间区间晚于当前时间再修改发布状态');
    } else {
      this.lastState = this.contestInfo.state;
      if (flag) {
        this.contestService.contestInfo.state = ContestState.noStarted;
      } else {
        this.contestService.contestInfo.state = ContestState.noPublished;
      }
    }
  }

  delete() {
    this.dialogService.showOkMessage('请问你确定要删除该考试吗', () => {
      this.contestService.delete(this.contestInfo.id).subscribe(r => {
        if (r === DeleteContestResultType.ok) {
          this.dialogService.showNoticeMessage('删除成功', () => {
            this.goBack();
          });
        } else {
          if (r === DeleteContestResultType.unauthorized) {
            this.dialogService.showErrorMessage('无权删除该考试');
          } else if (r === DeleteContestResultType.forbiddance) {
            this.dialogService.showErrorMessage('禁止删除该考试');
          } else if (r === DeleteContestResultType.contestNotFound) {
            this.dialogService.showErrorMessage('该考试不存在');
          } else {
            this.dialogService.showErrorMessage('网络错误');
          }
        }
      });
    });
  }

  reset() {
    this.studentCreate.reset();
    this.stepper.reset();
  }

  goBack() {
    this.router.navigate([this.url]);
  }
}
