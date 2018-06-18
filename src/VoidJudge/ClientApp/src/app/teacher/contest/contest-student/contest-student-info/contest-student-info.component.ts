import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';

import { ContestService } from '../../contest.service';
import { GetContestSubmissionResultType, SubmissionInfo } from '../../contest.model';
import { ContestSubmissionStateDialogComponent } from '../contest-submission-state-dialog/contest-submission-state-dialog.component';
import { ContestStudentService } from '../contest-student.service';
import { GetContestStudentResultType } from '../contest-student.model';
import { DialogService } from '../../../../shared/dialog/dialog.service';

@Component({
  selector: 'app-contest-student-info',
  templateUrl: './contest-student-info.component.html',
  styleUrls: ['./contest-student-info.component.css']
})
export class ContestStudentInfoComponent implements OnInit {
  displayedColumns = ['studentId', 'userName', 'group', 'isLogged', 'isSubmitted', 'id'];
  dataSource = new MatTableDataSource<SubmissionInfo>();
  isLoading = false;

  get contestInfo() {
    return this.contestService.contestInfo;
  }

  private url = '/teacher/contest';

  constructor(
    private contestService: ContestService,
    private contestStudentService: ContestStudentService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {
    this.gets();
  }

  ngOnInit() {}

  isNotEmpty() {
    return this.dataSource.data && this.dataSource.data.length > 0;
  }

  unlock(id: number) {
    this.contestStudentService.unlock(id).subscribe(r => {
      if (r === GetContestStudentResultType.ok) {
        this.dialogService.showNoticeMessage('解锁成功', () => {
          this.gets();
        });
      } else {
        this.dialogService.showErrorMessage('解锁失败', () => {
          this.gets();
        });
      }
    });
  }

  showSubmissionState(id: number) {
    this.dialog.open(ContestSubmissionStateDialogComponent, {
      data: this.contestInfo.submissionInfos.find(x => x.id === id),
      minWidth: '430px'
    });
  }

  gets() {
    this.isLoading = true;
    this.contestService
      .getSubmissionsInfo()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(r => {
        if (r.type === GetContestSubmissionResultType.ok) {
          this.flush(r.data);
        } else {
          this.flush([]);
        }
      });
  }
  private flush(sis: SubmissionInfo[]) {
    this.dataSource.data = sis.map(s => {
      return {
        id: s.id,
        studentId: s.studentId,
        userName: s.userName,
        group: s.group,
        isLogged: s.isLogged,
        isSubmitted: s.submissionStates.length > 0
      };
    });
  }
}
