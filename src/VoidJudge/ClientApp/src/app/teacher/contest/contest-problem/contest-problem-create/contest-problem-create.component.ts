import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggle } from '@angular/material';

import { ContestService } from '../../contest.service';
import { ContestProblemService } from '../contest-problem.service';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { FormErrorStateMatcher } from '../../../../shared/form-error-state-matcher';
import { AddContestProblemResultType } from '../contest-problem.model';

@Component({
  selector: 'app-contest-problem-create',
  templateUrl: './contest-problem-create.component.html',
  styleUrls: ['./contest-problem-create.component.css']
})
export class ContestProblemCreateComponent implements OnInit {
  @ViewChild('form') form: ElementRef;
  @ViewChild('fileForm') fileForm: ElementRef;
  problemForm: FormGroup;
  matcher = new FormErrorStateMatcher();

  get contestInfo() {
    return this.contestService.contestInfo;
  }

  private url = '/teacher/contest';

  constructor(
    private contestService: ContestService,
    private contestProblemService: ContestProblemService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.problemForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      type: new FormControl('0', [Validators.required])
    });
  }

  create(evt: any, fileForm: HTMLFormElement) {
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length === 0) {
      return;
    }
    const problemInfo = this.problemForm.value;
    problemInfo['contestId'] = this.contestInfo.id;
    problemInfo['type'] = Number(problemInfo['type']);
    this.contestProblemService.add(problemInfo, target.files[0]).subscribe(r => {
      if (r === AddContestProblemResultType.ok) {
        this.dialogService.showNoticeMessage('创建成功');
        this.reset();
      } else if (r === AddContestProblemResultType.fileTooBig) {
        this.dialogService.showErrorMessage('上传文件过大，创建失败');
        this.fileForm.nativeElement.reset();
      } else {
        this.dialogService.showErrorMessage('网络错误，创建失败');
      }
    });
  }

  reset() {
    this.form.nativeElement.reset();
    this.fileForm.nativeElement.reset();
  }
}
