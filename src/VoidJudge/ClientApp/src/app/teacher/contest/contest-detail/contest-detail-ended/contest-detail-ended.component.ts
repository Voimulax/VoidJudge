import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { ContestInfo, GetContestSubmissionResultType } from '../../contest.model';
import { ContestService } from '../../contest.service';
import { FileService } from '../../../../shared/file/file.service';
import { DialogService } from '../../../../shared/dialog/dialog.service';

@Component({
  selector: 'app-contest-detail-ended',
  templateUrl: './contest-detail-ended.component.html',
  styleUrls: ['./contest-detail-ended.component.css']
})
export class ContestDetailEndedComponent implements OnInit {
  @ViewChild('downloada') downloada: ElementRef;
  get contestInfo(): ContestInfo {
    return this.contestService.contestInfo;
  }

  private url = '/teacher/contest';

  constructor(
    private contestService: ContestService,
    private dialogService: DialogService,
    private fileService: FileService,
    private router: Router
  ) {}

  ngOnInit() {}

  updateContestInfo() {
    return () => this.contestService.updateCurrentContestInfo();
  }

  downloadSubmissionFile(event: MouseEvent, flag: boolean = false) {
    event.stopPropagation();
    if (flag) {
      this.contestService.getSubmissionsFile().subscribe(res => {
        if (res === GetContestSubmissionResultType.ok) {
          this.fileService.download(this.contestInfo.submissionsFileName).subscribe(r => {
            if (!r) {
              this.dialogService.showErrorMessage('下载失败');
            } else {
              this.downloada.nativeElement.href = r;
              this.downloada.nativeElement.download = this.contestInfo.submissionsFileName;
              this.downloada.nativeElement.click();
              this.downloada.nativeElement.href = '';
              this.downloada.nativeElement.download = '';
            }
          });
        } else {
          this.dialogService.showErrorMessage('下载失败');
        }
      });
    }
  }

  downloadSubmissionInfo() {
    this.contestService.getSubmissionsInfo().subscribe(r => {
      if (r.type === GetContestSubmissionResultType.ok) {
        const data = r.data.map(x => {
          const y = {};
          y['学号'] = x['studentId'];
          y['姓名'] = x['userName'];
          y['班级'] = x['group'];
          y['登录情况'] = x['isLogged'] === true ? '已登录' : '未登录';
          x['submissionStates'].forEach(s => {
            y[s['problemName']] = s['isSubmitted'] === true ? '已提交' : '未提交';
            y[`${s['problemName']}最后提交时间`] =
              s['isSubmitted'] === true ? moment(s['lastSubmitted']).format('YYYY-MM-DD HH:mm:ss') : '无';
          });
          return y;
        });
        this.fileService.saveExcelFile(data, `${this.contestInfo.name}提交信息.xlsx`);
      }
    });
  }

  goBack() {
    this.router.navigate([this.url]);
  }
}
