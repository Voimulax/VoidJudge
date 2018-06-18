import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { ContestInfo, GetContestSubmissionsResultType } from '../../contest.model';
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

  downloadSubmission(event: MouseEvent, flag: boolean) {
    event.stopPropagation();
    if (flag) {
      this.contestService.getSubmissions().subscribe(res => {
        if (res === GetContestSubmissionsResultType.ok) {
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

  downloadSubmissionInfo() {}

  goBack() {
    this.router.navigate([this.url]);
  }
}
