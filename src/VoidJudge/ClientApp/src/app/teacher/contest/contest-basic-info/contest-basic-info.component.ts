import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';

import { ContestService } from '../contest.service';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../../shared/form-error-state-matcher';
import { ContestInfo, PutContestResultType } from '../contest.model';

@Component({
  selector: 'app-contest-basic-info',
  templateUrl: './contest-basic-info.component.html',
  styleUrls: ['./contest-basic-info.component.css']
})
export class ContestBasicInfoComponent implements OnInit {
  contestForm: FormGroup;
  matcher = new FormErrorStateMatcher();

  get contestInfo() {
    return this.contestService.contestInfo;
  }

  constructor(private dialogService: DialogService, private contestService: ContestService, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.contestForm = this.fb.group({
      endTime: new FormControl(moment(this.contestService.contestInfo.endTime), [Validators.required]),
      notice: new FormControl(this.contestService.contestInfo.notice)
    });
  }

  save() {
    const contestInfo: ContestInfo = this.contestForm.value;
    contestInfo.id = this.contestInfo.id;

    const startTime = new Date(this.contestInfo.startTime).getTime();
    const endTime = new Date(contestInfo.endTime).getTime();
    if (startTime >= endTime) {
      this.dialogService.showErrorMessage('考试结束时间应晚于开始时间');
    } else {
      this.contestService.put(contestInfo).subscribe(r => {
        if (r === PutContestResultType.ok) {
          this.dialogService.showNoticeMessage('保存成功');
        } else {
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
}
