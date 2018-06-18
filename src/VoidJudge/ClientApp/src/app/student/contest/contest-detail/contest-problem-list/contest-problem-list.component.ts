import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { finalize } from 'rxjs/operators';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { ContestService } from '../../contest.service';
import { ContestProblemInfo, GetContestProblemResultType } from './contest-problem.model';
import { FileService } from '../../../../shared/file/file.service';
import { SubmissionInfo, AddSubmissionResultType, SubmissionType } from '../../contest.model';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-contest-problem-list',
  templateUrl: './contest-problem-list.component.html',
  styleUrls: ['./contest-problem-list.component.css']
})
export class ContestProblemListComponent implements OnInit {
  @ViewChild('downloada') downloada: ElementRef;
  displayedColumns = ['name', 'type', 'content', 'isSubmitted'];
  dataSource = new MatTableDataSource<ContestProblemInfo>();
  isLoading = false;

  get contestInfo() {
    return this.contestService.contestInfo;
  }

  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private contestService: ContestService,
    private fileService: FileService
  ) {
    if (this.contestService.contestInfo.id !== undefined) {
      this.gets();
    }
  }

  ngOnInit() {}

  isNotEmpty() {
    return this.dataSource.data && this.dataSource.data.length > 0;
  }

  download(event: MouseEvent, content: string) {
    event.stopPropagation();
    if (content !== undefined) {
      this.fileService.download(content).subscribe(r => {
        if (!r) {
          this.dialogService.showErrorMessage('下载失败');
        } else {
          this.downloada.nativeElement.href = r;
          this.downloada.nativeElement.download = content;
          this.downloada.nativeElement.click();
          this.downloada.nativeElement.href = '';
          this.downloada.nativeElement.download = '';
        }
      });
    }
  }

  create(evt: any, fileForm: HTMLFormElement, problemId: number) {
    evt.stopPropagation();
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length === 0) {
      return;
    }
    const submissionInfo: SubmissionInfo = {
      contestId: this.contestInfo.id,
      problemId: problemId,
      studentId: this.authService.user.loginName,
      type: SubmissionType.binary
    };
    this.contestService.addSubmission(submissionInfo, target.files[0]).subscribe(r => {
      if (r === AddSubmissionResultType.ok) {
        this.dialogService.showNoticeMessage('提交成功');
      } else if (r === AddSubmissionResultType.fileTooBig) {
        this.dialogService.showErrorMessage('上传文件过大，提交失败');
      } else {
        this.dialogService.showErrorMessage('网络错误，提交失败');
      }
      fileForm.reset();
      this.gets();
    });
  }

  gets() {
    this.isLoading = true;
    this.contestService
      .getProblems()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(r => {
        if (r.type === GetContestProblemResultType.ok) {
          this.dataSource.data = r.data;
        }
      });
  }
}
